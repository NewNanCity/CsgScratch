import React from 'react';
import { parseDocument } from 'yaml';
import { Resizable } from 're-resizable';
import ScratchBlocks from 'scratch-blocks';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { East, West } from '@mui/icons-material';
import { Helmet } from '@modern-js/runtime/head';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';

import './App.css';
import { version } from '@/data/version';
import { defineBlocks } from '@/data/blocks';
import defaultYaml from '@/data/defaultYaml';
import TitleBanner from '@/components/TitleBanner';
import { genToolbox } from '@/scratch/loader/toolbox';
import categories from '@/data/toolbox-categories.yml';
import { workspace2Yaml, dom2obj } from '@/data/workspace2Yaml';
import { yaml2workspaceDom, obj2dom } from '@/data/yaml2Workspace';
import {
  useTheme,
  useCMExtensions,
  ScratchInjectProps,
} from '@/components/hooks';

(globalThis as any).dom2obj = dom2obj;
(globalThis as any).obj2dom = obj2dom;
(globalThis as any).ScratchBlocks = ScratchBlocks;
(globalThis as any).workspace2Yaml = workspace2Yaml;

defineBlocks(ScratchBlocks);
ScratchBlocks.ScratchMsgs.setLocale('zh-cn');

export default React.memo(() => {
  const theme = useTheme();
  const extensions = useCMExtensions();
  const workspaceRef = React.useRef<any>();
  const [cmReady, setCMReady] = React.useState(false);
  const [errorCount, setErrorCount] = React.useState(0);
  const [scratchReady, setScratchReady] = React.useState(false);
  const toolbox = React.useMemo(() => genToolbox(categories), []);
  const mountScratch = React.useCallback((element: HTMLDivElement | null) => {
    // https://developers.google.com/blockly/guides/configure/web/configuration_struct
    const workspace = ScratchBlocks.inject(element, {
      ...ScratchInjectProps,
      toolbox,
    });
    workspaceRef.current = workspace;
    setScratchReady(true);
  }, []);
  const editorRef = React.useRef({
    set: (_: string): void => undefined,
    get: (): string => '',
  });
  const mountCodeMirror = React.useCallback(
    (ref: ReactCodeMirrorRef | null) => {
      if (ref?.editor && ref?.state && ref?.view) {
        const { view } = ref;
        editorRef.current = {
          get: () => view.state.doc.toString(),
          set: (text: string) =>
            view.dispatch({
              changes: {
                from: 0,
                to: view.state.doc.length,
                insert: text,
              },
            }),
        };
        setTimeout(() => {
          editorRef.current.set(defaultYaml);
          (globalThis as any).d = parseDocument(defaultYaml);
          setCMReady(true);
        }, 10);
      }
    },
    [],
  );
  const parseYaml = React.useCallback(() => {
    const d = parseDocument(editorRef.current.get());
    const t = d.toJS();
    workspaceRef.current.clear();
    workspaceRef.current.clearUndo();
    let errorCount = 0;
    const dom = yaml2workspaceDom(
      t.ControlTask,
      t.Trigger,
      JSON.parse(t.CsgScratchMeta ?? '{}'),
      ct => (d.getIn(['ControlTask', ct], true) as any)?.commentBefore,
      t => (d.getIn(['Trigger', t], true) as any)?.commentBefore,
      (ct, index) =>
        (d.getIn(['ControlTask', ct, index], true) as any)?.comment,
      (t, index) =>
        (d.getIn(['Trigger', t, 'Task', index], true) as any)?.comment,
      (...args) => {
        console.error(...args);
        errorCount++;
      },
    );
    try {
      ScratchBlocks.Xml.domToWorkspace(dom, workspaceRef.current);
    } catch (e) {
      errorCount++;
      setErrorCount(errorCount);
      throw e;
    }
    setErrorCount(errorCount);
  }, []);
  const stringifyYaml = React.useCallback(() => {
    const doc = parseDocument(editorRef.current.get());
    const meta: Record<string, any> = { version };
    let errorCount = 0;
    const { ControlTask, Trigger, commentMap } = workspace2Yaml(
      ScratchBlocks,
      workspaceRef.current,
      meta,
      (...args) => {
        console.error(...args);
        errorCount++;
      },
    );
    try {
      (doc as any).contents.set('Trigger', doc.createNode(Trigger));
      for (const [tName, [tComment, taskComments]] of Object.entries(
        commentMap.t,
      )) {
        (doc.getIn(['Trigger', tName], true) as any).commentBefore = tComment;
        for (let i = 0; i < taskComments.length; i++) {
          (doc.getIn(['Trigger', tName, 'Task', i], true) as any).comment =
            taskComments[i];
        }
      }
      (doc as any).contents.set('ControlTask', doc.createNode(ControlTask));
      for (const [ctName, [ctComment, taskComments]] of Object.entries(
        commentMap.ct,
      )) {
        (doc.getIn(['ControlTask', ctName], true) as any).commentBefore =
          ctComment;
        for (let i = 0; i < taskComments.length; i++) {
          (doc.getIn(['ControlTask', ctName, i], true) as any).comment =
            taskComments[i];
        }
      }
      (doc as any).contents.set(
        'CsgScratchMeta',
        doc.createNode(JSON.stringify(meta)),
      );
      editorRef.current.set(String(doc));
    } catch (e) {
      errorCount++;
      setErrorCount(errorCount);
      throw e;
    }
    setErrorCount(errorCount);
  }, []);
  React.useEffect(() => {
    if (cmReady && scratchReady) {
      parseYaml();
    }
  }, [cmReady, scratchReady]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <title>CsgScratch Editor</title>
      </Helmet>
      <TitleBanner />
      <Snackbar
        open={errorCount > 0}
        autoHideDuration={6000}
        onClose={() => setErrorCount(0)}
      >
        <MuiAlert
          onClose={() => setErrorCount(0)}
          severity="error"
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          转换过程中出现 {errorCount} 处错误，按 F12 <br />
          (如果没有反应请百度如何开启浏览器的开发者模式)
          <br />
          点击控制台(Console)查看详情
        </MuiAlert>
      </Snackbar>
      <Resizable
        defaultSize={{ width: '70%', height: '100%' }}
        enable={{ right: true }}
        minWidth="200px"
        maxWidth="95%"
        style={{ width: '100%', display: 'flex' }}
        handleClasses={{ right: 'editor-side-resize-bar' }}
        onResize={() => window.dispatchEvent(new Event('resize'))}
      >
        <div style={{ width: '100%', height: '100%' }} ref={mountScratch} />
        <div
          style={{
            height: '100%',
            width: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
            <IconButton
              disabled={!scratchReady || !cmReady}
              style={{
                background: 'black',
                border: '1px solid white',
                opacity: 0.75,
                borderRadius: '10px',
                marginBottom: '20px',
              }}
              onClick={parseYaml}
            >
              <West />
            </IconButton>
            <IconButton
              disabled={!scratchReady || !cmReady}
              style={{
                background: 'black',
                border: '1px solid white',
                opacity: 0.75,
                borderRadius: '10px',
              }}
              onClick={stringifyYaml}
            >
              <East />
            </IconButton>
          </div>
        </div>
      </Resizable>
      <CodeMirror
        ref={mountCodeMirror}
        extensions={extensions}
        height="100%"
        width="100%"
        theme={oneDark}
        indentWithTab={false}
        style={{
          fontSize: 18,
          height: '100%',
          width: '100%',
          borderLeft: '1px solid #fff7',
          overflowX: 'auto',
          cursor: 'text',
        }}
      />
    </ThemeProvider>
  );
});
