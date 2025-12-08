import Link from 'next/link';
import IconButton from './IconButton';

interface ActionButtonsProps {
  viewHref?: string;
  editHref?: string;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ActionButtons({
  viewHref,
  editHref,
  onDelete,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  size = 'sm'
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 items-center">
      {viewHref && (
        <Link href={viewHref} target="_blank" rel="noopener noreferrer">
          <IconButton
            icon="view"
            variant="secondary"
            size={size}
            label={viewLabel}
          />
        </Link>
      )}
      
      {editHref && (
        <Link href={editHref}>
          <IconButton
            icon="edit"
            variant="primary"
            size={size}
            label={editLabel}
          />
        </Link>
      )}
      
      {onDelete && (
        <IconButton
          icon="trash"
          variant="danger"
          size={size}
          onClick={onDelete}
          label={deleteLabel}
        />
      )}
    </div>
  );
}



