import Default from './Default';
import Basic from './Basic';
import Professional from './Professional';
import Unique from './Unique';
import Modern from './Modern';
import Classic from './Classic';
import Luxe from './Luxe';
import Elegant from './Elegant';

/**
 * The design registry.
 *
 * Keys match the names shown in the Design tab and the values persisted in
 * `selectedTemplate`, so existing saved resumes keep their design.
 */
export const PDF_TEMPLATES = {
  Default,
  Basic,
  Professional,
  Unique,
  Modern,
  Classic,
  Luxe,
  Elegant,
};

export const getTemplate = (name) => PDF_TEMPLATES[name] || PDF_TEMPLATES.Default;

export default PDF_TEMPLATES;
