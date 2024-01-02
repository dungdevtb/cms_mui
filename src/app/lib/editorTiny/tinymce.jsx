import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch } from "react-redux";
import { actionUploadOneFile } from 'redux/upload/action';
import customeStyle from './customeStyle';
// const clean = (value) => sanitizeHtml(value, {
//     allowedTags: [
//         "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
//         "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
//         "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
//         "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
//         "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
//         "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
//         "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "video", "image","img"
//     ],
//     disallowedTagsMode: 'discard',
//     allowedAttributes: {
//         a: [ 'href', 'name', 'target' ],
//         '*': [ 'style','width', 'height', 'border' ],
//         // these attributes would make sense if we did.
//         img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
//     },
// // Lots of these won't come up by default because we don't allow them
//     selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
// // URL schemes we permit
//     allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
//     allowedSchemesByTag: {},
//     allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
//     allowProtocolRelative: true,
//     enforceHtmlBoundary: false
// });

const EditorTiny = React.memo((props) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(props.data);
    const editorRef = useRef(props.data | null);

    const getdata = (editorRef) => {
        props.getData(editorRef.current.getContent())
    }

    // const handleUploadImage = async (blobInfo, success, failure) => {
    //     let imageUpload = blobInfo.blob()
    //     let formData = new FormData();
    //     formData.append("file", imageUpload);
    //     console.log(blobInfo, blobInfo.blob(), 'uploadContent')
    //     let url = await dispatch(actionUploadOneFile(formData))
    //     console.log(url, 'url');
    //     success(url);
    // }

    const handleUploadImage = (blobInfo, progress) => new Promise((resolve, reject) => {
        let imageUpload = blobInfo.blob()
        let formData = new FormData();
        formData.append("file", imageUpload);
        dispatch(actionUploadOneFile(formData)).then((url) => {
            resolve(url)
        })
    })


    useEffect(() => {
        setValue(props.data)
    }, [props])
    return (
        <>
            <Editor
                apiKey='r0q8mlxpw4np7xca7c61o13ktyqrejjgawoebdx579xtznm7'
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    getdata(editorRef)
                }}
                initialValue={value}
                init={{
                    height: 500,
                    plugins: 'save preview paste searchreplace autolink directionality visualblocks visualchars ' +
                        ' fullscreen template codesample table charmap hr pagebreak nonbreaking anchor toc ' +
                        'insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern  ' +
                        'help code image   ',
                    object_resizing: 'table, img, iframe, video, figure',
                    autosave_interval: '30s',
                    // images_upload_url: 'postAcceptor.php',
                    image_advtab: true,
                    entity_encoding: "raw",
                    image_caption: true,
                    verify_html: true,
                    extended_valid_elements: 'img[style|class|src|alt|title|width|loading=lazy]',
                    menubar: 'file edit view insert format tools table help',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect ' +
                        'formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist ' +
                        'bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  ' +
                        'preview save print | insertfile image  template link anchor codesample | ltr rtl | media',
                    toolbar_mode: 'wrap',
                    imagetools_cors_hosts: ['picsum.photos'],
                    noneditable_noneditable_class: 'mceNonEditable',
                    content_style: customeStyle,
                    contextmenu: 'link image imagetools table',
                    // quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    templates: [
                        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
                    ],
                    setup: function (editor) {
                        editor.on('Change', (e) => getdata(editorRef))
                    },
                    images_upload_handler: handleUploadImage,
                    // file_picker_callback: function(callback, value, meta) {
                    //     let url = ''
                    //     if (meta.filetype == 'image') {
                    //         var input = document.getElementById('my-file');
                    //         input.click();
                    //         input.onchange = async function () {
                    //             var file = input.files[0];
                    //             var reader = new FileReader();
                    //             reader.onload = function (e) {
                    //                 callback(e.target.result, {
                    //                     alt: file.name
                    //                 });
                    //
                    //             };
                    //             let formData = new FormData();
                    //             formData.append("file", file);
                    //             console.log(file)
                    //             url = await dispatch(uploadOneFile(formData))
                    //             let blob = new Blob
                    //             reader.readAsDataURL('https://nld.mediacdn.vn/thumb_w/540/2020/5/29/doi-hoa-tim-8-15907313395592061395682.png');
                    //         };
                    //     }
                    //     if (meta.filetype == 'media') {
                    //         var input = document.getElementById('my-file');
                    //         input.click();
                    //         input.onchange = function () {
                    //             var file = input.files[0];
                    //             // var reader = new FileReader();
                    //             // reader.onload = function (e) {
                    //             //     callback(e.target.result, {
                    //             //         alt: file.name
                    //             //     });
                    //             // };
                    //             // reader.readAsDataURL(file);
                    //
                    //         };
                    //     }
                    // }
                }}
                scriptLoading={{ async: true }}
            />
            <input id="my-file" type="file" name="my-file" style={{ display: 'none' }} onChange="" />
        </>
    );
})
export default EditorTiny