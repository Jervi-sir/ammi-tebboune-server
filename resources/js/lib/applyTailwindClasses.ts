import classNames from 'classnames';

export const applyTailwindClasses = (htmlContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const elements = doc.body.querySelectorAll('*');

  elements.forEach((element) => {
    switch (element.tagName.toLowerCase()) {
      case 'h1':
        element.className = classNames('text-3xl', 'font-bold', 'mb-4');
        break;
      case 'h2':
        element.className = classNames('text-2xl', 'font-bold', 'mb-3');
        break;
      case 'h3':
        element.className = classNames('text-xl', 'font-semibold', 'mb-2');
        break;
      case 'h4':
        element.className = classNames('text-lg', 'font-medium', 'mb-2');
        break;
      case 'h5':
        element.className = classNames('text-base', 'font-medium', 'mb-1');
        break;
      case 'h6':
        element.className = classNames('text-sm', 'font-medium', 'mb-1');
        break;
      case 'p':
        element.className = classNames('text-base', 'mb-4');
        break;
      case 'ul':
        element.className = classNames('list-disc', 'list-inside', 'mb-4');
        break;
      case 'ol':
        element.className = classNames('list-decimal', 'list-inside', 'mb-4');
        break;
      case 'li':
        element.className = classNames('mb-1');
        break;
      case 'a':
        element.className = classNames('text-blue-500', 'hover:underline');
        break;
      case 'strong':
        element.className = classNames('font-semibold');
        break;
      case 'em':
        element.className = classNames('italic');
        break;
      case 'blockquote':
        element.className = classNames('border-l-4', 'border-gray-300', 'pl-4', 'italic', 'mb-4');
        break;
      case 'pre':
        element.className = classNames('bg-gray-100', 'p-4', 'rounded', 'mb-4');
        break;
      case 'code':
        element.className = classNames('bg-gray-100', 'px-1', 'rounded');
        break;
      case 'img':
        element.className = classNames('rounded', 'mx-auto', 'my-4');
        break;
      case 'table':
        element.className = classNames('table-auto', 'w-full', 'border-collapse', 'border', 'border-gray-200', 'mb-4');
        break;
      case 'thead':
        element.className = classNames('bg-gray-100');
        break;
      case 'th':
        element.className = classNames('border', 'border-gray-200', 'px-4', 'py-2');
        break;
      case 'td':
        element.className = classNames('border', 'border-gray-200', 'px-4', 'py-2');
        break;
      // Add more cases as needed
      default:
        break;
    }
  });

  return doc.body.innerHTML;
};
