import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import Link from 'next/link';

const SurveysPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  // Mock survey data for now
  const surveys = [
    {
      id: '1',
      title: 'Employee Engagement Survey',
      description: 'Quarterly employee engagement and satisfaction assessment',
      status: 'published',
      createdAt: '2024-09-01',
      responses: 45,
    },
    {
      id: '2', 
      title: 'Organizational Culture Assessment',
      description: 'Annual culture and values evaluation',
      status: 'draft',
      createdAt: '2024-09-15',
      responses: 0,
    },
    {
      id: '3',
      title: 'Leadership 360 Feedback',
      description: '360-degree feedback for management team',
      status: 'published',
      createdAt: '2024-08-20',
      responses: 23,
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-1">Manage assessment surveys and questionnaires</p>
        </div>
        <Link href="/surveys/new" className="btn btn-primary">
          Create Survey
        </Link>
      </div>

      <div className="grid gap-6">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <Card.Body>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link href={`/surveys/${survey.id}`} className="hover:text-primary">
                        {survey.title}
                      </Link>
                    </h3>
                    <span className={getStatusBadge(survey.status)}>
                      {survey.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{survey.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{survey.responses} responses</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link 
                    href={`/surveys/${survey.id}/edit`}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/surveys/${survey.id}/responses`}
                    className="btn btn-ghost btn-sm"
                  >
                    View Responses
                  </Link>
                  <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li><a>Duplicate</a></li>
                      <li><a>Archive</a></li>
                      <li><a className="text-red-600">Delete</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {surveys.length === 0 && (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first assessment survey</p>
              <Link href="/surveys/new" className="btn btn-primary">
                Create Your First Survey
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default SurveysPage;