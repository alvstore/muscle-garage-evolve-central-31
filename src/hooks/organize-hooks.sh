#!/bin/bash

# Create directories if they don't exist
mkdir -p automation classes dashboard notifications reports store website

# Move automation-related hooks
mv use-automation-rules.ts use-automations.ts automation/

# Move class-related hooks
mv use-class-types.ts use-classes.ts use-trainers.ts classes/

# Move dashboard-related hooks
mv use-dashboard.ts use-finance-dashboard.ts use-stats.ts dashboard/

# Move notification-related hooks
mv use-announcements.ts use-notifications.ts use-reminder-rules.ts notifications/

# Move report-related hooks
mv use-reports.ts reports/

# Move store-related hooks
mv use-store-products.ts store/

# Move website-related hooks
mv use-website-content.ts website/

# Move remaining hooks to appropriate directories
mv use-branches.ts useBranchOperations.ts settings/
mv use-categories.ts settings/
mv use-feedback.ts settings/
mv use-leads.ts members/
mv use-motivational-messages.ts members/
mv use-referrals.ts members/
mv use-staff.ts members/
mv use-tasks.ts members/

# Update index.ts exports
echo '// Re-export all hooks for easier imports' > index.ts
echo '// This file is auto-generated. Do not edit manually.' >> index.ts
echo '' >> index.ts

# Add exports for each hook file
for file in $(find . -type f -name "*.ts" -o -name "*.tsx" | grep -v "index.ts" | sort); do
  if [[ "$file" != "./index.ts" && "$file" != "./use-hikvision-consolidated.ts" ]]; then
    rel_path="${file#./}"
    hook_name=$(basename "$rel_path" .ts | sed 's/.tsx$//')
    echo "export { $hook_name } from './$rel_path';" >> index.ts
  fi
done

echo '// Export from subdirectories' >> index.ts
echo 'export * from "./auth";' >> index.ts
echo 'export * from "./communication";' >> index.ts
echo 'export * from "./data";' >> index.ts
echo 'export * from "./finance";' >> index.ts
echo 'export * from "./members";' >> index.ts
echo 'export * from "./permissions";' >> index.ts
echo 'export * from "./settings";' >> index.ts
echo 'export * from "./ui";' >> index.ts
echo 'export * from "./utils";' >> index.ts
echo 'export * from "./automation";' >> index.ts
echo 'export * from "./classes";' >> index.ts
echo 'export * from "./dashboard";' >> index.ts
echo 'export * from "./notifications";' >> index.ts
echo 'export * from "./reports";' >> index.ts
echo 'export * from "./store";' >> index.ts
echo 'export * from "./website";' >> index.ts

echo "Hooks have been organized successfully!"
