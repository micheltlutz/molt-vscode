import * as cp from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

const STARTER = `use molt::prelude::*;

fn main() {
    let page = div()
        .add_class("card")
        .child(h1().text("Hello, Molt"))
        .child(p().text("Edit src/main.rs and run again."));

    println!("{}", page.render());
}
`;

// VS Code launched from the Dock does not inherit the shell PATH, so rustup's
// ~/.cargo/bin is added by hand.
function cargoEnv(): NodeJS.ProcessEnv {
  const cargoBin = path.join(os.homedir(), ".cargo", "bin");
  return { ...process.env, PATH: `${cargoBin}${path.delimiter}${process.env.PATH ?? ""}` };
}

function cargo(args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.execFile("cargo", args, { cwd, env: cargoEnv() }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function newProject(): Promise<void> {
  const name = await vscode.window.showInputBox({
    prompt: "Project name",
    value: "hello-molt",
    validateInput: (value) =>
      /^[a-z][a-z0-9_-]*$/.test(value) ? undefined : "Use lowercase letters, digits, - or _",
  });
  if (!name) {
    return;
  }
  const parent = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    openLabel: "Create project here",
  });
  if (!parent?.[0]) {
    return;
  }
  const root = parent[0].fsPath;
  const project = path.join(root, name);
  if (fs.existsSync(project)) {
    vscode.window.showErrorMessage(`${project} already exists.`);
    return;
  }
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Creating Molt project" },
      async () => {
        await cargo(["new", name], root);
        await cargo(["add", "molt-framework"], project);
        fs.writeFileSync(path.join(project, "src", "main.rs"), STARTER);
      },
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Could not create the project: ${(error as Error).message}`);
    return;
  }
  await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(project));
}

async function addDependency(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!folder || !fs.existsSync(path.join(folder, "Cargo.toml"))) {
    vscode.window.showErrorMessage("Open a folder that has a Cargo.toml first.");
    return;
  }
  try {
    await cargo(["add", "molt-framework"], folder);
    vscode.window.showInformationMessage("molt-framework added. Import it as `molt`.");
  } catch (error) {
    vscode.window.showErrorMessage(`cargo add failed: ${(error as Error).message}`);
  }
}

function run(): void {
  const terminal = vscode.window.createTerminal({ name: "Molt", env: cargoEnv() as Record<string, string> });
  terminal.show();
  terminal.sendText("cargo run");
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("molt.newProject", newProject),
    vscode.commands.registerCommand("molt.addDependency", addDependency),
    vscode.commands.registerCommand("molt.run", run),
  );
}

export function deactivate(): void {}
