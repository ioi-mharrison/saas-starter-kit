import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import Link from 'next/link';

const Dashboard: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pulse Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Surveys</h3>
                <p className="text-gray-600">Manage assessment surveys</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/surveys" className="btn btn-primary btn-sm">
                Manage Surveys
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
                <p className="text-gray-600">Manage tenant organizations</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/teams" className="btn btn-primary btn-sm">
                View Organizations
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View assessment insights</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="btn btn-outline btn-sm" disabled>
                Coming Soon
              </button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Link href="/surveys/new" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Create New Survey</div>
                <div className="text-sm text-gray-600">Set up a new assessment survey</div>
              </Link>
              <Link href="/teams?newTeam=true" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Add Organization</div>
                <div className="text-sm text-gray-600">Onboard a new tenant organization</div>
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Recent Activity</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here as surveys are created and responses are collected</p>
            </div>
          </Card.Body>
        </Card>
      </div>
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

export default Dashboard;
