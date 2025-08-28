import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Button component types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Input component types
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Card component types
export interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'outline' | 'elevated';
}

// Modal component types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
}

// Table component types
export interface TableColumn<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onSelect?: (selectedRows: T[]) => void;
  onRowClick?: (row: T, index: number) => void;
}

// Badge component types
export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
}

// Alert component types
export interface AlertProps extends BaseComponentProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
}

// Dropdown component types
export interface DropdownItem {
  id: string;
  label: string;
  value?: any;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps extends BaseComponentProps {
  items: DropdownItem[];
  placeholder?: string;
  value?: string;
  onChange?: (item: DropdownItem) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  trigger?: ReactNode;
}

// Tabs component types
export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps extends BaseComponentProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (tabId: string) => void;
}

// Pagination component types
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showTotal?: boolean;
  showQuickJumper?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

// Tooltip component types
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  children: ReactNode;
}

// Progress component types
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
}

// Select component types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  onChange?: (value: string | number | (string | number)[]) => void;
}

// Textarea component types
export interface TextareaProps extends BaseComponentProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  fullWidth?: boolean;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

// Checkbox component types
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  error?: string;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}

// Radio component types
export interface RadioProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string | number;
  label?: string;
  error?: string;
  onChange?: (checked: boolean) => void;
}

// Switch component types
export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (checked: boolean) => void;
}

// DatePicker component types
export interface DatePickerProps extends BaseComponentProps {
  value?: Date;
  defaultValue?: Date;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  locale?: string;
  onChange?: (date: Date | null) => void;
}

// FileUpload component types
export interface FileUploadProps extends BaseComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  error?: string;
  helperText?: string;
  dragAndDrop?: boolean;
  preview?: boolean;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
}

// LoadingSpinner component types
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: number;
  speed?: number;
}

// MetricCard component types
export interface MetricCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: ReactNode;
  trend?: {
    data: Array<{ date: string; value: number }>;
    color?: string;
  };
}

// Chart component types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface ChartProps extends BaseComponentProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'polarArea';
  data: ChartData;
  options?: Record<string, any>;
  height?: number;
  width?: number;
}

// Form component types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  validation?: Record<string, any>;
  options?: SelectOption[];
  placeholder?: string;
  helperText?: string;
}

export interface FormProps extends BaseComponentProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
}

// Layout component types
export interface LayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onToggle?: () => void;
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    href?: string;
    children?: Array<{
      id: string;
      label: string;
      href: string;
    }>;
  }>;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export interface HeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  userMenu?: ReactNode;
  notifications?: ReactNode;
  search?: ReactNode;
}

// Navigation component types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  activeItem?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  onItemClick?: (item: NavigationItem) => void;
}

// Data display component types
export interface DataTableProps<T = any> extends TableProps<T> {
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onExport?: (format: string) => void;
}

export interface DataGridProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: Array<{
    key: string;
    header: string;
    render?: (value: any, row: T) => ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string | number;
  }>;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSelect?: (selectedRows: T[]) => void;
}

// Feedback component types
export interface ToastProps extends BaseComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

export interface NotificationProps extends BaseComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp?: Date;
  read?: boolean;
  actions?: ReactNode;
  onClose?: () => void;
  onClick?: () => void;
}

// Overlay component types
export interface OverlayProps extends BaseComponentProps {
  isOpen: boolean;
  onClose?: () => void;
  backdrop?: boolean;
  backdropClassName?: string;
  zIndex?: number;
}

export interface DrawerProps extends OverlayProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  footer?: ReactNode;
}

export interface PopoverProps extends BaseComponentProps {
  content: ReactNode;
  trigger: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  triggerType?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Utility component types
export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  size?: 'sm' | 'md' | 'lg';
}

export interface SpacerProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  axis?: 'horizontal' | 'vertical';
}

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

// All component types are already exported individually above 