import {mountDocumentViewer} from './document-viewer.mjs';

const sampleInput = document.querySelector('#sample');
const status = document.querySelector('#status');
let viewer, requestVersion = 0;

async function loadModel() {
  const request = ++requestVersion;
  status.textContent = '正在读取模型…';
  status.dataset.error = 'false';
  viewer?.destroy();
  viewer = null;
  document.querySelector('#current-viewer').replaceChildren();
  document.querySelector('#model-path').textContent = '';
  document.querySelector('#model-title').textContent = '模型.sysml';
  document.querySelector('#sample-note').textContent = '';
  try {
    const response = await fetch('/api/preview?sample=' + encodeURIComponent(sampleInput.value));
    const result = await response.json();
    if (request !== requestVersion) return;
    if (!response.ok) throw Error(result.error || '模型加载失败');
    viewer = mountDocumentViewer(document.querySelector('#current-viewer'), {file: result.file, model: result.model});
    document.querySelector('#model-title').textContent = result.file.path.split('/').at(-1);
    document.querySelector('#model-path').textContent = result.file.path;
    document.querySelector('#sample-note').textContent = result.note;
    status.textContent = result.model.valid ? '已加载当前模型，语义检查通过' : '当前模型未通过语义检查，图形仅为部分结果，请查看诊断';
    status.dataset.error = String(!result.model.valid);
    history.replaceState(null, '', '?' + new URLSearchParams({sample: sampleInput.value}));
  } catch (error) {
    if (request !== requestVersion) return;
    viewer?.destroy();
    viewer = null;
    document.querySelector('#current-viewer').replaceChildren();
    status.textContent = '未显示新结果：' + error.message;
    status.dataset.error = 'true';
  }
}

const initial = new URLSearchParams(location.search);
if (['original', 'connected'].includes(initial.get('sample'))) sampleInput.value = initial.get('sample');
sampleInput.addEventListener('change', loadModel);
document.querySelector('#reload').addEventListener('click', loadModel);
await loadModel();
