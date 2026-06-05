import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Researcher from '@/lib/models/Researcher';
import Proposal from '@/lib/models/Proposal';
import Grant from '@/lib/models/Grant';
import Review from '@/lib/models/Review';
import ContactMessage from '@/lib/models/ContactMessage';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection') || 'proposals';
  const format = searchParams.get('format') || 'csv';
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const status = searchParams.get('status');

  // Build date filter
  const dateFilter: Record<string, Date> = {};
  if (dateFrom) dateFilter['$gte'] = new Date(dateFrom);
  if (dateTo) dateFilter['$lte'] = new Date(dateTo);
  const createdAtFilter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
  const statusFilter = status ? { status } : {};

  try {
    let data: any[] = [];

    if (collection === 'researchers') {
      data = await Researcher.find(createdAtFilter).lean();
    } else if (collection === 'proposals') {
      data = await Proposal.find({ ...createdAtFilter, ...statusFilter }).lean();
    } else if (collection === 'grants') {
      data = await Grant.find(createdAtFilter).lean();
    } else if (collection === 'reviews') {
      data = await Review.find(createdAtFilter).lean();
    } else if (collection === 'messages') {
      data = await ContactMessage.find(createdAtFilter).lean();
    } else if (collection === 'all') {
      const [researchers, proposals, grants, reviews, messages] = await Promise.all([
        Researcher.find({}).lean(),
        Proposal.find({}).lean(),
        Grant.find({}).lean(),
        Review.find({}).lean(),
        ContactMessage.find({}).lean(),
      ]);
      const allData = { researchers, proposals, grants, reviews, messages };
      return new NextResponse(JSON.stringify(allData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="full_export_${Date.now()}.json"`,
        },
      });
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${collection}_${Date.now()}.json"`,
        },
      });
    }

    // CSV conversion
    if (data.length === 0) {
      return new NextResponse('No data found', { status: 404 });
    }

    const keys = Object.keys(data[0]).filter(k => k !== '__v');
    const csvRows = [
      keys.join(','),
      ...data.map(row =>
        keys.map(k => {
          const val = (row as any)[k];
          if (val === null || val === undefined) return '';
          if (Array.isArray(val)) return `"${val.join('; ')}"`;
          if (val instanceof Date) return val.toISOString();
          const str = String(val).replace(/"/g, '""');
          return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
        }).join(',')
      ),
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${collection}_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('[Export Error]', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
