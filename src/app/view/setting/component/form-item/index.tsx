// 创建一个FormItem React组件，用来渲染表单的项
import React from "react";
import classnames from "classnames";

type FormItemProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
};

const FormItem: React.FC<FormItemProps> = ({ label, className, children }) => (
  <div className={classnames("flex items-center mb-16", className)}>
    {label && <span className="font-weight-500">{label}</span>}
    {children}
  </div>
);

export default FormItem;
