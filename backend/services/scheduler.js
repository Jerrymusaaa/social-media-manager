const cron = require('node-cron');
const Post = require('../models/Post');

// Check for scheduled posts every minute
const startScheduler = () => {
  console.log('📅 Post scheduler started - checking every minute');

  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find posts that are scheduled and due to be posted
      const scheduledPosts = await Post.find({
        status: 'scheduled',
        scheduledFor: { $lte: now }
      }).populate('user');

      if (scheduledPosts.length > 0) {
        console.log(`📤 Found ${scheduledPosts.length} posts ready to be published`);
      }

      for (const post of scheduledPosts) {
        try {
          // Update post status to posted
          post.status = 'posted';
          post.postedAt = new Date();
          
          // If cross-posting is enabled, mark for all platforms
          if (post.crossPost && post.crossPost.enabled) {
            console.log(`🌐 Cross-posting to: ${post.crossPost.platforms.join(', ')}`);
            // In the future, you'll implement actual API calls here
          }

          await post.save();

          console.log(`✅ Published post: ${post._id} to ${post.platform}`);
          
          // Here you would call the actual social media APIs
          // For now, we're just changing the status
          // await postToLinkedIn(post);
          // await postToTwitter(post);
          // etc.

        } catch (error) {
          console.error(`❌ Error publishing post ${post._id}:`, error);
          post.status = 'failed';
          await post.save();
        }
      }

    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  });
};

module.exports = { startScheduler };