import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

type FeatureItem = {
  title: ReactNode;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: (
      <Translate id="homepage.features.first.title">
        Built for Rapid Upstream Delivery
      </Translate>
    ),
    Svg: require('@site/static/img/rapid-upstream-delivery.svg').default,
    description: (
      <Translate id="homepage.features.first.description">
        Rolling releases with upstream tracking bring new RISC-V features and
        fixes to you sooner—less waiting, less rework.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.second.title">
        Built for RISC-V Developers
      </Translate>
    ),
    Svg: require('@site/static/img/risc-v-developers.svg').default,
    description: (
      <Translate id="homepage.features.second.description">
        Stay close to upstream to reduce backports and forks.
        Easier reproduction, faster debugging, smoother upstream contributions.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.third.title">
        Built for Early Validation
      </Translate>
    ),
    Svg: require('@site/static/img/early-validation.svg').default,
    description: (
      <Translate id="homepage.features.third.description">
        Surfaces firmware, platform semantics, and Linux interoperability issues
        early—so vendors fix faster, reduce divergence, and reach mainstream OS
        compatibility sooner.
      </Translate>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
