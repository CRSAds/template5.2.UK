import { handleFooterDisplay } from './footerControl.js';
import initFlow from './initFlow.js';
import { setupFormSubmit } from './formSubmit.js'; // ✅ goed
import { setupImageFix } from './imageFix.js';

handleFooterDisplay();
setupImageFix();
initFlow();
setupFormSubmit();
