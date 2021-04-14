import React, { useRef, useMemo } from 'react';
import clsx from 'clsx';
import Editor, { useMonaco, EditorProps } from '@monaco-editor/react';

import { useTheme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    editorWrapper: { position: 'relative' },
    resizeIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      color: theme.palette.text.disabled,
    },
    saveButton: {
      marginTop: theme.spacing(1),
    },
  })
);

export interface ICodeEditorProps extends EditorProps {
  height?: number;
  wrapperProps?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  disabled?: boolean;
  extraLibs?: string[];
}

export default function CodeEditor({
  height = 400,
  wrapperProps,
  disabled,
  extraLibs,
  options,
  ...props
}: ICodeEditorProps) {
  const theme = useTheme();

  const classes = useStyles();
  const monacoInstance = useMonaco();

  const editorRef = useRef<any>();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  const themeTransformer = (theme: string) => {
    switch (theme) {
      case 'dark':
        return 'vs-dark';
      default:
        return theme;
    }
  };

  useMemo(() => {
    if (!monacoInstance) {
      // useMonaco returns a monaco instance but initialisation is done asynchronously
      // dont execute the logic until the instance is initialised
      return;
    }

    try {
      monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
        {
          noSemanticValidation: true,
          noSyntaxValidation: false,
        }
      );
      // compiler options
      monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions(
        {
          target: monacoInstance.languages.typescript.ScriptTarget.ES5,
          allowNonTsExtensions: true,
        }
      );

      if (extraLibs) {
        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
          extraLibs.join('\n'),
          'ts:filename/extraLibs.d.ts'
        );
      }
    } catch (error) {
      console.error(
        'An error occurred during initialization of Monaco: ',
        error
      );
    }
  }, [monacoInstance]);

  return (
    <div
      {...wrapperProps}
      className={clsx(classes.editorWrapper, wrapperProps?.className)}
    >
      <Editor
        theme={themeTransformer(theme.palette.type)}
        height={height}
        onMount={handleEditorDidMount}
        language="javascript"
        options={{
          readOnly: disabled,
          fontFamily: theme.typography.fontFamilyMono,
          ...options,
        }}
        {...props}
      />
    </div>
  );
}
