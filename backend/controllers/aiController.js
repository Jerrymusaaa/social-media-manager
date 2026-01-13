// Mock AI Controller for Testing (No OpenAI API calls)

// Generate LinkedIn caption from image description
exports.generateCaption = async (req, res) => {
  try {
    const { description, tone = 'professional', length = 'medium' } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Please provide an image description' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock caption based on tone and length
    let caption;
    
    if (tone === 'professional') {
      caption = `🚀 Exciting developments in our journey!\n\n${description}\n\nThis experience has reinforced our commitment to innovation and excellence. Proud to be part of a team that's pushing boundaries and making a real impact.\n\nWhat are your thoughts on this approach? I'd love to hear your perspective in the comments!\n\n#Innovation #Leadership #Technology #Growth #TeamWork`;
    } else if (tone === 'casual') {
      caption = `Hey everyone! 👋\n\nJust wanted to share this awesome moment: ${description}\n\nSo grateful for experiences like these! They remind me why I love what I do. 💯\n\nDrop a comment if you've had similar experiences!\n\n#GoodVibes #Blessed #LivingMyBestLife #Grateful`;
    } else {
      caption = `Important update:\n\n${description}\n\nThis represents a significant milestone in our ongoing efforts to drive meaningful change and innovation.\n\nLooking forward to continued progress.\n\n#Professional #Business #Industry #Excellence`;
    }

    // Adjust length
    if (length === 'short') {
      caption = caption.split('\n').slice(0, 3).join('\n') + '\n\n#Innovation #Growth';
    } else if (length === 'long') {
      caption += '\n\nAs we continue on this journey, I\'m reminded of the importance of collaboration, persistence, and staying true to our vision. Every step forward is a testament to the dedication of everyone involved.\n\nWhat strategies have you found effective in your own work? Let\'s discuss!\n\n#Strategy #Future #Impact';
    }

    res.json({
      caption: caption,
      description: description,
      tone: tone,
      length: length,
      mock: true // Indicates this is a mock response
    });

  } catch (error) {
    console.error('Mock AI Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating caption', 
      error: error.message 
    });
  }
};

// Regenerate caption with modifications
exports.regenerateCaption = async (req, res) => {
  try {
    const { description, previousCaption, feedback, tone = 'professional' } = req.body;

    if (!description || !previousCaption) {
      return res.status(400).json({ 
        message: 'Please provide description and previous caption' 
      });
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate improved mock caption
    const regeneratedCaption = `✨ Improved version:\n\n${description}\n\nTaking your feedback into account: "${feedback || 'Making it better'}"\n\nThis refined approach better captures the essence of what we're trying to achieve. Innovation isn't just about the destination—it's about the journey and the lessons learned along the way.\n\nYour thoughts? Let's continue the conversation!\n\n#Innovation #Improvement #Excellence #Growth #Community`;

    res.json({
      caption: regeneratedCaption,
      description: description,
      tone: tone,
      mock: true
    });

  } catch (error) {
    console.error('Mock AI Regeneration Error:', error);
    res.status(500).json({ 
      message: 'Error regenerating caption', 
      error: error.message 
    });
  }
};