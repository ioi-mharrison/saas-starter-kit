import Link from 'next/link';
import { type ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FAQSection from '@/components/defaultLanding/FAQSection';
import HeroSection from '@/components/defaultLanding/HeroSection';
import FeatureSection from '@/components/defaultLanding/FeatureSection';
import PricingSection from '@/components/defaultLanding/PricingSection';
import useTheme from 'hooks/useTheme';
import env from '@/lib/env';
import Head from 'next/head';

const Home: NextPageWithLayout = () => {
  const { toggleTheme, selectedTheme } = useTheme();
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('homepage-title')}</title>
      </Head>

      <div className="container mx-auto">
        <div className="navbar bg-base-100/95 backdrop-blur-sm sticky top-0 z-50 px-0 sm:px-1 border-b border-gray-100">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl normal-case font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pulse
              </span>
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal flex items-center gap-2 sm:gap-4">
              <li className="hidden md:block">
                <a href="#features" className="btn btn-ghost">Features</a>
              </li>
              <li className="hidden md:block">
                <a href="#pricing" className="btn btn-ghost">Pricing</a>
              </li>
              {env.darkModeEnabled && (
                <li>
                  <button
                    className="bg-none p-0 rounded-lg flex items-center justify-center"
                    onClick={toggleTheme}
                  >
                    <selectedTheme.icon className="w-5 h-5" />
                  </button>
                </li>
              )}
              <li>
                <Link
                  href="/auth/login"
                  className="btn btn-outline btn-md py-3 px-2 sm:px-4 hover:bg-primary hover:text-white transition-all rounded-full"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/join"
                  className="btn btn-primary btn-md py-3 px-2 sm:px-4 text-white shadow-lg hover:shadow-xl transition-all rounded-full"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <HeroSection />
        <FeatureSection />
        <div id="pricing">
          <PricingSection />
        </div>
        <FAQSection />
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Redirect to login page if landing page is disabled
  if (env.hideLandingPage) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Home;
