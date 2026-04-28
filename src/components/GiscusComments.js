import React, {useEffect, useRef} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GiscusComments() {
  const containerRef = useRef(null);
  const {siteConfig} = useDocusaurusContext();
  const giscus = siteConfig.customFields.giscus;

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !giscus) {
      return undefined;
    }

    const script = document.createElement('script');
    const scriptUrl = new URL('/client.js', giscus.hostname).toString();

    script.src = scriptUrl;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', giscus.repository);
    script.setAttribute('data-repo-id', giscus.repositoryId);
    script.setAttribute('data-category', giscus.category);
    script.setAttribute('data-category-id', giscus.categoryId);
    script.setAttribute('data-mapping', giscus.mapping);
    script.setAttribute('data-reactions-enabled', giscus.reactionsEnabled);
    script.setAttribute('data-emit-metadata', giscus.emitMetadata);
    script.setAttribute('data-theme', giscus.theme);
    script.setAttribute('data-lang', 'en');

    container.replaceChildren(script);

    return () => {
      container.replaceChildren();
    };
  }, [giscus]);

  return (
    <section aria-labelledby="comments-heading" className="margin-top--xl">
      <h2 id="comments-heading">Comments</h2>
      <div ref={containerRef} />
    </section>
  );
}
