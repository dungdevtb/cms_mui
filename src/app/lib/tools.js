import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'

export const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,
    embed: {
        class: Embed,
        inlineToolbar: true
    },
    table: Table,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: {
        class: LinkTool,
        config: {
            endpoint: `${process.env.REACT_APP_API_URL}/app/other/fetchUrl`
        }
    },
    image: {
        class: Image,
        config: {
            endpoints: {
                byFile: `${process.env.REACT_APP_API_URL}/api/uploadImageEditor`, // Your backend file uploader endpoint
                byUrl: `${process.env.REACT_APP_API_URL}/api/uploadImageEditor`, // Your endpoint that provides uploading by Url
            }
        }
    },
    raw: Raw,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage,
}