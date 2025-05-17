#!/bin/bash

# Create directories
mkdir -p {api,auth,communication,finance,members,settings,ui}

# Move files to appropriate directories
# API
mv database.ts api/

# Auth
mv auth.ts auth/
mv user.ts auth/
mv user.d.ts auth/

# Communication
mv notification.ts communication/
mv notification.d.ts communication/
mv webhooks.ts communication/

# Finance
mv finance.ts finance/
mv finance.d.ts finance/
mv invoice.ts finance/
mv payment.ts finance/
mv tax.ts finance/

# Members
mv member.ts members/
mv member.d.ts members/
mv trainer.ts members/
mv trainer.d.ts members/
mv membership.ts members/
mv membership-assignment.ts members/
mv measurements.ts members/

# Settings
mv branch.ts settings/
mv device-mapping.ts settings/

# UI
mv theme.ts ui/

# Create index files
# API
cat > api/index.ts << 'EOL'
// API related types
export * from '../database';
EOL

# Auth
cat > auth/index.ts << 'EOL'
// Authentication and user related types
export * from '../auth';
export * from '../user';
EOL

# Communication
cat > communication/index.ts << 'EOL'
// Communication related types
export * from '../notification';
export * from '../webhooks';
EOL

# Finance
cat > finance/index.ts << 'EOL'
// Finance related types
export * from '../finance';
export * from '../invoice';
export * from '../payment';
export * from '../tax';
EOL

# Members
cat > members/index.ts << 'EOL'
// Member and related types
export * from '../member';
export * from '../trainer';
export * from '../membership';
export * from '../membership-assignment';
export * from '../measurements';
EOL

# Settings
cat > settings/index.ts << 'EOL'
// Application settings types
export * from '../branch';
export * from '../device-mapping';
EOL

# UI
cat > ui/index.ts << 'EOL'
// UI related types
export * from '../theme';
EOL

# Update root index.ts
cat > index.ts << 'EOL'
// Re-export all types from their respective modules
export * from './api';
export * from './auth';
export * from './communication';
export * from './finance';
export * from './members';
export * from './settings';
export * from './ui';

// Export any remaining types that don't fit into the above categories
export * from './route';
export * from './navigation';
EOL

echo "Types reorganization complete. Please review the changes and test the application."
