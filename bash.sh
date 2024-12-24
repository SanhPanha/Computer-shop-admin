#!/bin/bash

# Prompt for commit message
echo "Enter your commit message:"
read commit_message

# Add all changes to the Git repository
git add .

# Commit changes with the provided message
git commit -m "$commit_message"


# Print a message indicating success
echo "Changes committed successfully!"

git push 
