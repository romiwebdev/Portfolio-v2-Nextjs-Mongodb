import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Edit, Trash2, GripVertical } from 'lucide-react';

const ItemType = 'PROJECT';

const DraggableProjectRow = ({ 
  project, 
  index, 
  moveProject, 
  handleEdit, 
  handleDelete 
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveProject(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver ? '#f0fdf4' : 'transparent';

  return (
    <tr 
      ref={ref}
      style={{ opacity, backgroundColor }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div
            ref={drag}
            className="mr-2 cursor-move text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={16} />
          </div>
          <img
            src={project.cover}
            alt={project.name}
            className="h-12 w-12 object-cover rounded"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{project.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {project.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => handleEdit(project)}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => handleDelete(project)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default DraggableProjectRow;