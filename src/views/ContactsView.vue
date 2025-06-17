<template>
  <Container>
    <div class="contacts">
      <div class="header-row">
        <h1>Contacts</h1>
        <HelpToggle>
          <h3>Contacts Help</h3>
          <p>Import your contacts by clicking the "Import Contacts" button and selecting a JSON file.</p>
          <p>Click the email icon to send an email.</p>
          <p>Click the phone icon to make a call.</p>
          <p>If you don't import any contacts, default contacts will be shown.</p>
        </HelpToggle>
      </div>

      <div class="buttons-row">

        <!-- Import Section -->
        <div class="import-section">
          <input type="file" accept=".json" @change="handleFileImport" class="file-input" id="contacts-import">
          <label for="contacts-import" class="import-button">
            Import Contacts (JSON)
          </label>
          <span v-if="importError" class="error-message">{{ importError }}</span>
        </div>


        <div class="download-section">
          <a href="/data/contacts.json" download="/data/contacts.json" class="download-button">
            Download template (JSON)
          </a>
        </div>
      </div>


      <!-- Loading State -->
      <div v-if="isLoading" class="loading-message">
        Loading contacts...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Contacts List -->
      <div v-else class="contacts-list">
        <div v-for="contact in allData" :key="contact.id" class="contact-item">
          <span class="contact-name">{{ contact.name }}</span>
          <span class="contact-title">{{ contact.title }}</span>
          <a v-if="contact.email" :href="`mailto:${contact.email}`" class="contact-link">
            📧
          </a>
          <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="contact-link">
            📱
          </a>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Container from '../components/Container.vue'
import HelpToggle from '../components/HelpToggle.vue'
import type { Contact } from '../types/types'
import { useImportData } from '../composables/useImportData'
import { useImportableData } from '../composables/useImportableData'
import { useErrorHandler } from '../composables/useErrorHandler'
import { useLoadingState } from '../composables/useLoadingState'

// Type guard for Contact array
const isContactArray = (data: unknown): data is Contact[] => {
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' &&
    item !== null &&
    'name' in item
  )
}

// Process imported contacts to ensure they have unique IDs
const processImportedContacts = (contacts: Contact[]): Contact[] => {
  return contacts.map(contact => ({
    ...contact,
    id: contact.id || `default_${Math.random().toString(36).substr(2, 9)}`
  }))
}

// Initialize composables
const { error, handleError } = useErrorHandler()
const { isLoading, withLoading } = useLoadingState()

const {
  allData,
  loadDefaultData,
  handleImportedData,
  initializeFromStore
} = useImportableData<Contact>({
  defaultDataPath: '/data/contacts.json',
  storeKey: 'contacts',
  validator: isContactArray,
  processImportedData: processImportedContacts
})

const {
  importError,
  handleFileImport: baseHandleFileImport
} = useImportData<Contact>({
  validator: isContactArray,
  onSuccess: handleImportedData,
  onError: handleError,
  allowedTypes: ['.json', 'application/json'],
  hasExistingData: () => allData.value.length > 0
})

// Wrap the file import handler to use loading state
const handleFileImport = (event: Event) => {
  withLoading(Promise.resolve(baseHandleFileImport(event)))
}

onMounted(async () => {
  console.log('ContactsView mounted')
  try {
    console.log('Loading default data...')
    await withLoading(loadDefaultData())
    console.log('Default data loaded:', allData.value)

    console.log('Initializing from store...')
    initializeFromStore()
    console.log('Store initialized, all data:', allData.value)
  } catch (err) {
    console.error('Error in onMounted:', err)
    handleError(err)
  }
})
</script>

<style scoped>
.contacts {
  padding: 1rem 0;
}


.file-input {
  display: none;
}


.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.contact-name {
  font-weight: 500;
  color: var(--text-color);
  /* min-width: 150px; */
}

.contact-title {
  color: #666;
  flex: 1;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: opacity 0.2s;
}

.contact-link:hover {
  opacity: 0.8;
}
</style>