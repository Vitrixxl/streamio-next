import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

type FormItemProps =
  | (
    & {
      label: string;
      id: string;
      error?: string | null;
      itemType?: 'input';
      containerClassName?: string;
    }
    & React.InputHTMLAttributes<HTMLInputElement>
  )
  | (
    & {
      label: string;
      id: string;
      error?: string | null;
      itemType: 'textarea';
      containerClassName?: string;
    }
    & React.TextareaHTMLAttributes<HTMLTextAreaElement>
  );
export const FormItem = (
  { label, id, error, itemType, containerClassName, ...props }: FormItemProps,
) => {
  return (
    <div className={containerClassName}>
      <Label htmlFor={id}>{label}</Label>
      {itemType === 'textarea'
        ? (
          <Textarea
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
            id={id}
          />
        )
        : (
          <Input
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
            id={id}
          />
        )}
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
};
