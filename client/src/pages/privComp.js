import React from 'react';

import { useAuth } from '../hooks/useAuth';

export default function PrivComp() {
  const data = useAuth();
  console.log(data);
  return <div>this is a private component</div>;
}
