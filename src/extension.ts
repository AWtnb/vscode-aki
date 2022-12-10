import * as vscode from "vscode";

const getEOF = (editor: vscode.TextEditor): vscode.Position => {
  const maxLineIdx = editor.document.lineCount - 1;
  return new vscode.Position(maxLineIdx, editor.document.lineAt(maxLineIdx).text.length);
};

class Aki {
  pattern: string;
  reg: RegExp;
  constructor(safeCharPattern: string) {
    this.pattern = "(?<!" + safeCharPattern + ")\\s+|\\s+(?!" + safeCharPattern + ")";
    this.reg = new RegExp(this.pattern, "g");
  }

  private getRanges(editor: vscode.TextEditor, start: vscode.Position, end: vscode.Position): vscode.Range[] {
    const found: vscode.Range[] = [];
    for (let i = start.line; i <= end.line; i++) {
      const line = editor.document.lineAt(i);
      let result;
      while ((result = this.reg.exec(line.text)) !== null) {
        const matchStart = new vscode.Position(i, result.index);
        const matchEnd = new vscode.Position(i, result.index + result[0].length);
        found.push(new vscode.Range(matchStart, matchEnd));
      }
    }
    return found.filter((range) => {
      return range.start.isAfterOrEqual(start) && range.end.isBeforeOrEqual(end);
    });
  }

  selectAll(editor: vscode.TextEditor) {
    const start = new vscode.Position(0, 0);
    const end = getEOF(editor);
    editor.selections = this.getRanges(editor, start, end).map((range) => {
      return new vscode.Selection(range.start, range.end);
    });
  }

  selectOnCurrentLine(editor: vscode.TextEditor) {
    const start = new vscode.Position(editor.selection.start.line, 0);
    const end = new vscode.Position(editor.selection.end.line, editor.document.lineAt(editor.selection.end.line).text.length);
    editor.selections = this.getRanges(editor, start, end).map((range) => {
      return new vscode.Selection(range.start, range.end);
    });
  }

  splitSelection(editor: vscode.TextEditor) {
    if (editor.selection.isEmpty) {
      return;
    }
    editor.selections = this.getRanges(editor, editor.selection.start, editor.selection.end).map((range) => {
      return new vscode.Selection(range.start, range.end);
    });
  }

  jumpFore(editor: vscode.TextEditor) {
    const rangeAfter = this.getRanges(editor, editor.selection.end, getEOF(editor));
    if (rangeAfter.length) {
      const next = rangeAfter[0];
      editor.selection = new vscode.Selection(next.start, next.end);
    }
  }

  jumpBack(editor: vscode.TextEditor) {
    const rangeBefore = this.getRanges(editor, new vscode.Position(0, 0), editor.selection.start);
    if (rangeBefore.length) {
      const previous = rangeBefore.slice(-1)[0];
      editor.selection = new vscode.Selection(previous.start, previous.end);
    }
  }
}

const config = vscode.workspace.getConfiguration("aki");
const safeChars: string = config.get("safeChars") || "";
const AKI = new Aki(safeChars);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("aki.selectAll", (editor: vscode.TextEditor) => {
      AKI.selectAll(editor);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("aki.selectOnCurrentLine", (editor: vscode.TextEditor) => {
      AKI.selectOnCurrentLine(editor);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("aki.splitSelection", (editor: vscode.TextEditor) => {
      AKI.splitSelection(editor);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("aki.jumpFore", (editor: vscode.TextEditor) => {
      AKI.jumpFore(editor);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("aki.jumpBack", (editor: vscode.TextEditor) => {
      AKI.jumpBack(editor);
    })
  );
}

export function deactivate() {}
