import { forwardRef, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any;
  theme?: string;
  className?: string;
}

/**
 * Wrapper component for ReactQuill
 * Note: findDOMNode warning is suppressed globally in App.tsx
 */
export const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>(
  ({ value, onChange, placeholder, modules, theme = 'snow', className }, ref) => {
    const editorRef = useRef<ReactQuill | null>(null);

    return (
      <ReactQuill
        ref={(el) => {
          editorRef.current = el;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        value={value}
        onChange={onChange}
        theme={theme}
        placeholder={placeholder}
        modules={modules}
        className={className}
      />
    );
  }
);

QuillEditor.displayName = 'QuillEditor';
