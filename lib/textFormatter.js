export const formatText = (text) => {
    if (!text) return '';
    
    // Escape HTML tags first for security
    const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Process [[highlight]] syntax
    const withHighlights = escaped.replace(
      /\[\[(.*?)\]\]/g,
      '<span class="gradient_text">$1</span>'
    );
    
    // Process **bold** syntax
    const withBold = withHighlights.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold">$1</strong>'
    );
    
    // Convert newlines to <br> tags
    return withBold.replace(/\n/g, '<br />');
  };

  