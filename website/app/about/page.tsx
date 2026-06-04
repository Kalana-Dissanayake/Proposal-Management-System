import React from 'react';

export const metadata = {
  title: 'About Us | GrantPortal',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About GrantPortal</h1>
      
      <div className="prose prose-indigo max-w-none text-gray-700 text-lg space-y-6">
        <p>
          GrantPortal is a comprehensive funding and proposal management system designed specifically for research institutions, universities, and funding bodies.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
        <p>
          To accelerate scientific discovery by streamlining the grant application and peer-review process, ensuring that the most promising research receives the funding it deserves with maximum efficiency and transparency.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li><strong>Discover:</strong> Researchers can browse a comprehensive list of active and upcoming grants.</li>
          <li><strong>Apply:</strong> Submit detailed research proposals, including abstracts, methodologies, and budgets.</li>
          <li><strong>Review:</strong> Administrative staff assign incoming proposals to relevant domain experts.</li>
          <li><strong>Evaluate:</strong> Reviewers score the proposals based on scientific merit, impact, and feasibility.</li>
          <li><strong>Decide:</strong> The institution makes final funding decisions based on reviewer recommendations.</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Key Benefits</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>For Researchers:</strong> A centralized hub to find grants and track proposal statuses.</li>
          <li><strong>For Reviewers:</strong> An intuitive interface for providing structured feedback and scores.</li>
          <li><strong>For Administrators:</strong> Powerful dashboard analytics and workflow management to handle the entire grant lifecycle.</li>
        </ul>
      </div>
    </div>
  );
}
