import { Card } from '@/components/shared';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const NewSurveyPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'engagement',
    frequency: 'quarterly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual API call to create survey
    console.log('Creating survey:', formData);
    
    // For now, simulate success and redirect
    setTimeout(() => {
      router.push('/surveys');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const surveyCategories = [
    { value: 'engagement', label: 'Employee Engagement' },
    { value: 'culture', label: 'Organizational Culture' },
    { value: 'leadership', label: 'Leadership Assessment' },
    { value: 'satisfaction', label: 'Job Satisfaction' },
    { value: 'wellbeing', label: 'Employee Wellbeing' },
    { value: 'performance', label: 'Performance Review' },
    { value: 'custom', label: 'Custom Assessment' },
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'biannually', label: 'Twice a Year' },
    { value: 'annually', label: 'Annually' },
    { value: 'onetime', label: 'One-time Survey' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Survey</h1>
          <p className="text-gray-600 mt-1">Set up a new assessment survey for your organization</p>
        </div>
        <Link href="/surveys" className="btn btn-outline">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Basic Information</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="label">
                  <span className="label-text font-medium">Survey Title *</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., Q3 Employee Engagement Survey"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Describe the purpose and goals of this survey..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="label">
                    <span className="label-text font-medium">Category</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    {surveyCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="frequency" className="label">
                    <span className="label-text font-medium">Frequency</span>
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Survey Configuration</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="alert alert-info">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Coming Soon</h3>
                  <div className="text-xs">Advanced survey configuration options including question builders, logic flows, and response validation will be available in the next release.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">25+</div>
                  <div className="text-sm text-gray-600">Question Types</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Smart</div>
                  <div className="text-sm text-gray-600">Logic Flows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Real-time</div>
                  <div className="text-sm text-gray-600">Analytics</div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Link href="/surveys" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Create Survey
          </button>
        </div>
      </form>
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

export default NewSurveyPage;