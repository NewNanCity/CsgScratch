import React from 'react';
import {
  indentUnit,
  indentOnInput,
  StreamLanguage,
} from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { createTheme } from '@mui/material/styles';
import { keymap, drawSelection } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { standardKeymap, indentWithTab } from '@codemirror/commands';

export const useTheme = () =>
  React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          background: {
            primary: '#282C34',
          },
        },
      } as any),
    [],
  );

const codemirrorLanguage = EditorState.phrases.of({
  // @codemirror/view
  'Control character': '控制字符',
  // @codemirror/fold
  'Folded lines': '已折叠的行',
  'Unfolded lines': '未折叠的行',
  to: '至',
  'folded code': '已折叠的代码',
  unfold: '未折叠',
  'Fold line': '折叠该行',
  'Unfold line': '展开该行',
  // @codemirror/search
  'Go to line': '跳转至行',
  go: '跳转',
  Find: '查找',
  Replace: '替换',
  next: '下一个匹配项',
  previous: '上一个匹配项',
  all: '选择所有',
  'match case': '区分大小写',
  regexp: '使用正则表达式',
  replace: '替换',
  'replace all': '全部替换',
  close: '关闭',
  'current match': '当前匹配',
  'on line': '位于行上',
  // @codemirror/lint
  Diagnostics: '检查程序',
  'No diagnostics': '无检查程序',
});

export const useCMExtensions = () =>
  React.useMemo(
    () => [
      autocompletion({ activateOnTyping: true }),
      codemirrorLanguage,
      EditorState.tabSize.of(2),
      indentUnit.of('  '),
      keymap.of(standardKeymap),
      keymap.of([indentWithTab]),
      // EditorView.lineWrapping,
      drawSelection(),
      StreamLanguage.define(yaml),
      indentOnInput(),
    ],
    [],
  );

export const ScratchInjectProps = {
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.675,
    maxScale: 4,
    minScale: 0.25,
    scaleSpeed: 1.1,
  },
  grid: {
    spacing: 40,
    length: 2,
    colour: '#666',
  },
  colours: {
    workspace: '#282C34',
    flyout: '#202329',
    toolbox: '#3C404A',
    toolboxText: '#FFFFFF',
    toolboxSelected: '#202329',
    scrollbar: '#797979',
    scrollbarHover: '#797979',
    insertionMarker: '#FFFFFF',
    insertionMarkerOpacity: 0.3,
    fieldShadow: 'rgba(255, 255, 255, 0.3)',
    dragShadowOpacity: 0.6,
    scrollbarOpacity: 0.4,
  },
  comments: true,
  collapse: true,
  sounds: true,
  media: './media/',
  scrollbars: true,
};
