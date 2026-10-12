import React, { useEffect, useId, useRef, useState } from "react";
import "./rich-text-editor.scss";

// The TinyMCE iframe is a separate document and can't read the admin CSS vars,
// so the content palette is resolved here and re-applied when the admin theme
// toggles (see the MutationObserver effect below).
const isDarkMode = () =>
  !!document.querySelector(".betterdocs-admin.betterdocs-dark-mode");

const getEditorPalette = (isDark) =>
  isDark
    ? { text: "#e6e8eb", bg: "#0c0f14", quoteBorder: "#3a4250", quoteText: "#aab0ba", codeBg: "#232a35", placeholder: "#6b7280" }
    : { text: "#1e1e1e", bg: "#ffffff", quoteBorder: "#ccc", quoteText: "#555", codeBg: "#f0f0f1", placeholder: "#757575" };

const buildEditorContentStyle = (ed) =>
  [
    `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;`,
    `font-size:14px;line-height:1.65;color:${ed.text};background:${ed.bg};padding:14px 18px;margin:0;}`,
    "body p{margin:0 0 1em;}body p:last-child{margin-bottom:0;}",
    `body h1,body h2,body h3,body h4,body h5,body h6{color:${ed.text};font-weight:600;line-height:1.3;margin:1.2em 0 .6em;}`,
    `body blockquote{border-left:4px solid ${ed.quoteBorder};margin:1em 0;padding:.25em 1em;color:${ed.quoteText};}`,
    `body code,body pre{font-family:Menlo,Consolas,Monaco,monospace;font-size:13px;background:${ed.codeBg};border-radius:3px;}`,
    "body code{padding:1px 6px;}body pre{padding:12px 14px;}",
    "body ul,body ol{padding-left:1.6em;}",
    `body[data-placeholder]:empty::before{content:attr(data-placeholder);color:${ed.placeholder};}`
  ].join("");

// Re-theme an already-initialized editor's iframe by injecting/replacing a
// style tag in its document head (overrides the init-time content_style).
const applyEditorTheme = (editorId) => {
  const tmce = window.tinymce && window.tinymce.get(editorId);
  const doc = tmce && tmce.getDoc && tmce.getDoc();
  const head = doc && (doc.head || doc.getElementsByTagName("head")[0]);
  if (!head) return;
  let styleEl = doc.getElementById("bd-faq-editor-theme");
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = "bd-faq-editor-theme";
    head.appendChild(styleEl);
  }
  styleEl.textContent = buildEditorContentStyle(getEditorPalette(isDarkMode()));
};

const TextEditor = ({ aiValue = null, value, onChange, placeholder, onReady, resetKey }) => {
  // useId() yields a stable, collision-free id per instance and is safe under
  // React Strict Mode (a module-level counter can double-increment). Colons
  // from useId() are stripped because TinyMCE/QuickTags use the id in CSS
  // selectors where ":" is invalid.
  const reactId = useId();
  const editorIdRef = useRef(
    `betterdocs-faq-editor-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  );
  const editorId = editorIdRef.current;
  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  const initializedRef = useRef(false);
  // The initial value is captured once at mount. Subsequent `value` updates
  // from the parent are intentionally ignored — the live editor (TinyMCE /
  // QuickTags) is the source of truth once mounted, and re-applying `value`
  // on every keystroke would fight the user's cursor. AI insertions go
  // through the separate `aiValue` effect below.
  const initialValueRef = useRef(value || "");
  // Latest `value`, kept fresh so a resetKey bump can reload the editor with the
  // current (saved) content without making `value` a live-controlled prop.
  const valueRef = useRef(value || "");
  useEffect(() => {
    valueRef.current = value || "";
  }, [value]);

  // The classic editor loads as two separate scripts: wp.editor (the API) and
  // wp-tinymce (window.tinymce — the Visual-mode core, a larger file that lands
  // later). When this component mounts early — e.g. the top-level "Add New FAQ"
  // form rendered on page load — tinymce isn't ready yet, so wp.editor.initialize
  // would produce only the plain textarea. Wait for BOTH before initializing,
  // and re-run once they're available.
  const isEditorReady = () =>
    Boolean(window.wp && window.wp.editor && window.tinymce);
  const [wpEditorReady, setWpEditorReady] = useState(isEditorReady);

  useEffect(() => {
    if (wpEditorReady) return;
    const intervalId = setInterval(() => {
      if (isEditorReady()) {
        setWpEditorReady(true);
        clearInterval(intervalId);
      }
    }, 150);
    return () => clearInterval(intervalId);
  }, [wpEditorReady]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (initializedRef.current || !window.wp || !window.wp.editor || !window.tinymce) {
      return;
    }
    initializedRef.current = true;

    const emitChange = (content) => {
      if (typeof onChangeRef.current === "function") {
        onChangeRef.current(content);
      }
    };

    window.wp.editor.initialize(editorId, {
      tinymce: {
        wpautop: true,
        toolbar1:
          "formatselect,bold,italic,underline,strikethrough,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,unlink,wp_more,wp_adv",
        toolbar2:
          "fontsizeselect,forecolor,backcolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,code,wp_help",
        height: 200,
        menubar: false,
        branding: false,
        content_style: buildEditorContentStyle(getEditorPalette(isDarkMode())),
        // Keep false: true would inline pasted images as base64 directly into
        // post_content, which can balloon a single FAQ to multiple MB when
        // pasting from Notion / Word. Users should use the Media Library button.
        paste_data_images: false,
        paste_as_text: false,
        paste_remove_styles: true,
        paste_remove_styles_if_webkit: true,
        paste_strip_class_attributes: "all",
        paste_merge_formats: true,
        paste_webkit_styles: "none",
        setup: function (editor) {
          editor.on("init", function () {
            if (initialValueRef.current) {
              editor.setContent(initialValueRef.current);
            }
            // Placeholder is applied once on init. Later `placeholder` prop
            // changes are not re-applied — it is a static label in practice.
            if (placeholder) {
              editor.getBody().setAttribute("data-placeholder", placeholder);
            }
            // Signal that the editor is fully initialized (final height exists).
            // wp-tinymce loads late, so this is the only reliable point to run
            // layout-dependent work like the dashboard "Add New FAQ" scroll.
            if (typeof onReadyRef.current === "function") {
              // In that flow the user should land on the top field — don't let
              // the freshly-initialized editor keep focus and scroll ITSELF into
              // view (which buries the form top, esp. on SPA navigation).
              try {
                editor.getBody().blur();
                const win = editor.getWin && editor.getWin();
                if (win && typeof win.blur === "function") win.blur();
              } catch (e) {
                // editor window not reachable; ignore
              }
              onReadyRef.current();
            }
          });
          // Sync editor → React state. Includes ExecCommand so toolbar
          // actions (Bold, Italic, lists, etc.) emit changes too — keyup
          // alone misses mouse-click formatting and was dropping inline
          // tags like <strong> from saved content.
          editor.on(
            "change keyup paste input undo redo execcommand",
            function () {
              emitChange(editor.getContent());
            }
          );
        },
      },
      quicktags: { buttons: "strong,em,link,block,del,ins,img,ul,ol,li,code,more,close" },
      mediaButtons: true,
    });

    const textarea = document.getElementById(editorId);
    const handleTextareaInput = () => {
      const tmce = window.tinymce && window.tinymce.get(editorId);
      if (!tmce || tmce.isHidden()) {
        emitChange(textarea ? textarea.value : "");
      }
    };
    if (textarea) {
      textarea.addEventListener("input", handleTextareaInput);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", handleTextareaInput);
      }
      if (window.wp && window.wp.editor) {
        try {
          window.wp.editor.remove(editorId);
        } catch (e) {
          // editor already removed; safe to ignore
        }
      }
      initializedRef.current = false;
    };
    // Re-run only when wp.editor transitions to ready (it initializes once via
    // initializedRef). `value` and `placeholder` are read from refs captured at
    // mount (see initialValueRef above), so they are deliberately excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpEditorReady]);

  // Re-theme the editor iframe when the admin light/dark mode toggles after
  // init (the .betterdocs-dark-mode class flips on <body>). Without this the
  // editor keeps the palette it was initialized with.
  useEffect(() => {
    const observer = new MutationObserver(() => applyEditorTheme(editorId));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [editorId, wpEditorReady]);

  useEffect(() => {
    if (!aiValue) {
      return;
    }
    const tmce = window.tinymce && window.tinymce.get(editorId);
    if (tmce) {
      tmce.setContent(aiValue);
      tmce.save();
      if (typeof onChangeRef.current === "function") {
        onChangeRef.current(tmce.getContent());
      }
      return;
    }
    const textarea = document.getElementById(editorId);
    if (textarea) {
      textarea.value = aiValue;
      if (typeof onChangeRef.current === "function") {
        onChangeRef.current(aiValue);
      }
    }
  }, [aiValue, editorId]);

  // QA-010: when the parent bumps `resetKey` (e.g. a FAQ row was reopened),
  // reload the editor with the current saved value so stale/unsaved content from
  // a previous edit doesn't linger. Skip the initial mount — init already seeds
  // the content from initialValueRef.
  const skipFirstResetRef = useRef(true);
  useEffect(() => {
    if (skipFirstResetRef.current) {
      skipFirstResetRef.current = false;
      return;
    }
    const tmce = window.tinymce && window.tinymce.get(editorId);
    if (tmce) {
      tmce.setContent(valueRef.current || "");
      tmce.save();
    } else {
      const textarea = document.getElementById(editorId);
      if (textarea) {
        textarea.value = valueRef.current || "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return (
    <div className="bd-faq-editor bd-faq-editor-wp">
      <textarea
        id={editorId}
        className="bd-faq-editor-textarea wp-editor-area"
        defaultValue={value || ""}
        placeholder={placeholder}
        rows={8}
      />
    </div>
  );
};

export default TextEditor;
