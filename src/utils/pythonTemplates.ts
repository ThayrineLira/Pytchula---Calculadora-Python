import pythonGuiSource from '../../calculadora_pytchula_gui.py?raw';
import pythonCliSource from '../../calculadora_pytchula_cli.py?raw';
import mascotDataUrl from '../assets/images/pytchula_mascot.png?inline';

export const PYTHON_GUI_SCRIPT = pythonGuiSource.replace(
  'MASCOT_IMAGE_DATA_URL_PLACEHOLDER',
  mascotDataUrl,
);

export const PYTHON_CLI_SCRIPT = pythonCliSource;

export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/x-python;charset=utf-8' }));
  element.href = url;
  element.download = filename;
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
