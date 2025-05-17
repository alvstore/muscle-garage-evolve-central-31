#!/bin/bash

# Create directories
mkdir -p {api,auth,communication,finance,members,settings,utils}

# Move files to appropriate directories
# API
mv api.ts api/
mv supabaseClient.ts api/

# Auth
mv auth/ auth-backup/
mv permissionService.ts auth/
mv auth-backup/* auth/ 2>/dev/null
rmdir auth-backup 2>/dev/null

# Communication
mv communicationService.ts communication/
mv notificationService.ts communication/
mv websiteContentService.ts communication/

# Finance
mv financeService.ts finance/
mv invoiceService.ts finance/
mv paymentService.ts finance/
mv taxService.ts finance/
mv invoiceSettingsService.ts finance/

# Members
mv memberService.ts members/
mv membersService.ts members/
mv membershipService.ts members/
mv trainerService.ts members/
mv trainersService.ts members/
mv measurementService.ts members/
mv classService.ts members/
mv class-types-service.ts members/

# Settings
mv settingsService.ts settings/
mv integrationService.ts settings/
mv integrationsService.ts settings/
mv backupService.ts settings/
mv biometricService.ts settings/

# Utils
mv storageService.ts utils/
mv navigationService.ts utils/

# Create index files
# API
cat > api/index.ts << 'EOL'
export * from './api';
export * from './supabaseClient';
EOL

# Auth
cat > auth/index.ts << 'EOL'
export * from './auth';
export * from './permissionService';
EOL

# Communication
cat > communication/index.ts << 'EOL'
export * from './communicationService';
export * from './notificationService';
export * from './websiteContentService';
EOL

# Finance
cat > finance/index.ts << 'EOL'
export * from './financeService';
export * from './invoiceService';
export * from './paymentService';
export * from './taxService';
export * from './invoiceSettingsService';
EOL

# Members
cat > members/index.ts << 'EOL'
export * from './memberService';
export * from './membersService';
export * from './membershipService';
export * from './trainerService';
export * from './trainersService';
export * from './measurementService';
export * from './classService';
export * from './class-types-service';
EOL

# Settings
cat > settings/index.ts << 'EOL'
export * from './settingsService';
export * from './integrationService';
export * from './integrationsService';
export * from './backupService';
export * from './biometricService';
EOL

# Utils
cat > utils/index.ts << 'EOL'
export * from './storageService';
export * from './navigationService';
EOL

echo "Services reorganization complete. Please review the changes and test the application."
