import React from 'react';

import XmIcon from '@xm/icons-taskity/dist/react';

type FormItemProps = {
  icon: string;
  label: string;
  children: React.ReactNode;
};
const FormItem: React.FC<FormItemProps> = ({ icon, label, children }) => {
  return (
    <div className="flex items-center c-gray4 text-14 py-4">
      <span className="flex items-center">
        <XmIcon name={icon} size={16} />
      </span>
      <span className="ml-8">{label}</span>
      <div className="flex-1 ml-12 text-right">{children}</div>
    </div>
  );
};

export default FormItem;
