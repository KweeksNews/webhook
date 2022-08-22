import { Config } from '../config';
import { Layout } from '../components/core';
import { Content } from '../components/home';

export default function Home() {
  return (
    <Layout manifest={true} navLinks={Config.nav}>
      <Content navLinks={Config.nav} />
    </Layout>
  );
}
