import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemFooter from '@theme-original/BlogPostItem/Footer';
import GiscusComments from '@site/src/components/GiscusComments';

export default function BlogPostItemFooterWrapper() {
  const {isBlogPostPage} = useBlogPost();

  return (
    <>
      <BlogPostItemFooter />
      {isBlogPostPage && <BrowserOnly>{() => <GiscusComments />}</BrowserOnly>}
    </>
  );
}
