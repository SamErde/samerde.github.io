import React from 'react';
import Admonition from '@theme/Admonition';

export function SecurityNote({title = 'Security note', children}) {
  return (
    <Admonition type="warning" title={title}>
      {children}
    </Admonition>
  );
}

export function Prerequisites({title = 'Prerequisites', children}) {
  return (
    <Admonition type="info" title={title}>
      {children}
    </Admonition>
  );
}

export function TestedWith({title = 'Tested with', children}) {
  return (
    <Admonition type="tip" title={title}>
      {children}
    </Admonition>
  );
}

export function AdminImpact({title = 'Administrative impact', children}) {
  return (
    <Admonition type="danger" title={title}>
      {children}
    </Admonition>
  );
}

export function PowerShellVersion({title = 'PowerShell version', children}) {
  return (
    <Admonition type="note" title={title}>
      {children}
    </Admonition>
  );
}
