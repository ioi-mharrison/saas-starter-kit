import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SurveyDetailPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  // Mock survey data - in real app, this would be fetched based on ID
  const survey = {
    id: id as string,
    title: 'Employee Engagement Survey',
    description: 'Quarterly employee engagement and satisfaction assessment to measure team morale, job satisfaction, and organizational alignment.',
    status: 'published',
    category: 'engagement',
    frequency: 'quarterly',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-15',
    createdBy: 'John Doe',
    responses: 45,
    totalInvited: 120,
    completionRate: 37.5,
    questions: [
      {
        id: '1',
        type: 'likert',
        text: 'How satisfied are you with your current role?',
        required: true,
      },
      {
        id: '2', 
        type: 'likert',
        text: 'How likely are you to recommend this company as a great place to work?',
        required: true,
      },
      {
        id: '3',
        type: 'text',
        text: 'What aspects of your job do you find most fulfilling?',
        required: false,
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full';
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
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
            <span className={getStatusBadge(survey.status)}>
              {survey.status}
            </span>
          </div>
          <p className="text-gray-600 max-w-3xl">{survey.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/surveys/${id}/edit`} className="btn btn-outline">
            Edit Survey
          </Link>
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-outline">
              Actions
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Duplicate Survey</a></li>
              <li><a>Export Data</a></li>
              <li><a>Archive</a></li>
              <li><a className="text-red-600">Delete</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Survey Overview</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-bold text-primary">{survey.responses}</div>
                  <div className="text-sm text-gray-600">Responses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{survey.totalInvited}</div>
                  <div className="text-sm text-gray-600">Invited</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{survey.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{survey.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Questions ({survey.questions.length})</Card.Title>
                <Link href={`/surveys/${id}/questions`} className="btn btn-outline btn-sm">
                  Edit Questions
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {survey.questions.map((question, index) => (
                  <div key={question.id} className="border-l-4 border-primary pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {question.type}
                          </span>
                          {question.required && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-900">{question.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Survey Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="text-gray-900 capitalize">{survey.category}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Frequency</div>
                  <div className="text-gray-900 capitalize">{survey.frequency}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Created By</div>
                  <div className="text-gray-900">{survey.createdBy}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Created</div>
                  <div className="text-gray-900">{new Date(survey.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="text-gray-900">{new Date(survey.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <Link href={`/surveys/${id}/responses`} className="btn btn-outline btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Responses
                </Link>
                <Link href={`/surveys/${id}/analytics`} className="btn btn-outline btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Analytics
                </Link>
                <button className="btn btn-outline btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Survey
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default SurveyDetailPage;