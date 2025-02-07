<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import CrudTable from "@/components/crud/CrudTable.vue";
import {api} from '@/services/api'

type FormData = {
  Name?: string
  Surname?: string
  Email?: string
  Age?: string
  FavoriteColor?: string
  ContactPreference?: Array<string>
  createdAt?: string
  updatedAt?: string
}

let formData = ref<FormData>({
  Name: undefined,
  Surname: undefined,
  Email: undefined,
  Age: undefined,
  FavoriteColor: undefined,
  ContactPreference: [],
})

let fieldErrors = ref<Record<string, string|undefined>>({})

const rows = ref<Array<Record<string, any>>>([])

const headers = [
  {key: 'Name', value: 'Name'},
  {key: 'Surname', value: 'Surname'},
  {key: 'Email', value: 'Email'},
  {key: 'Age', value: 'Age'},
  {key: 'FavoriteColor', value: 'Favorite color'},
  {key: 'ContactPreference', value: 'Contact preference'},
  {key: 'Actions', value: 'Actions'},
]

const validators = {
  email: (v?:string) => {
    if (!v) {
      return false
    }

    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
  },
  age: (v?:string) => {
    if (!v) {
      return false
    }

    return /^(0|[1-9][0-9]?|1[01][0-9]|120)$/.test(v)
  },
  contactPreference: (v?:Array<string>) => {
    return !!v?.length
  }
}

const validForm = computed(() => {
  const validEmail = validators.email(formData.value.Email)
  const validAge = validators.age(formData.value.Age)
  const validContactPreference = validators.contactPreference(formData.value.ContactPreference)

  return validEmail && validAge && validContactPreference
})

const errorMessage = ref('')

function validateField(fieldName: keyof typeof formData.value, rule: (input: any) => boolean, errorMessage: string = 'field is invalid') {
  const valid: boolean = rule(formData.value[fieldName])

  if (!valid) {
    fieldErrors.value[fieldName] = errorMessage
  } else {
    delete fieldErrors.value[fieldName]
  }
}

onMounted(async () => {
  try {
    const users = await api.getUsers()
    rows.value = users.map((user: any) => ({
      Name: user.name,
      Surname: user.surname,
      Email: user.email,
      Age: user.age?.toString(),
      FavoriteColor: user.favorite_color,
      ContactPreference: user.contact_preference,
      id: user._id
    }))
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Unknown error'
  }
})

async function create() {
  try {
    const userData = {
      name: formData.value.Name,
      surname: formData.value.Surname,
      email: formData.value.Email!,
      age: parseInt(formData.value.Age!),
      favorite_color: formData.value.FavoriteColor,
      contact_preference: formData.value.ContactPreference || []
    }
    
    const newUser = await api.createUser(userData)
    
    rows.value.push({
      Name: newUser.name,
      Surname: newUser.surname,
      Email: newUser.email,
      Age: newUser.age?.toString(),
      FavoriteColor: newUser.favorite_color,
      ContactPreference: newUser.contact_preference,
      id: newUser._id
    })
    
    resetForm()
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Unknown error'
  }
}

async function update(index: number) {
  try {
    const userId = rows.value[index].id
    if (!userId) throw new Error('No user ID found')

    const userData = {
      name: formData.value.Name,
      surname: formData.value.Surname,
      email: formData.value.Email!,
      age: parseInt(formData.value.Age!),
      favorite_color: formData.value.FavoriteColor,
      contact_preference: formData.value.ContactPreference || []
    }

    const updatedUser = await api.updateUser(userId, userData)
    
    rows.value[index] = {
      Name: updatedUser.name,
      Surname: updatedUser.surname,
      Email: updatedUser.email,
      Age: updatedUser.age?.toString(),
      FavoriteColor: updatedUser.favorite_color,
      ContactPreference: updatedUser.contact_preference,
      id: updatedUser._id
    }
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Unknown error'
  }
}

function preview(index: number) {
  formData.value = {
    Name: rows.value[index].Name,
    Surname: rows.value[index].Surname,
    Email: rows.value[index].Email,
    Age: rows.value[index].Age,
    FavoriteColor: rows.value[index].FavoriteColor,
    ContactPreference: rows.value[index].ContactPreference
  }
}

function exportJSON() {
  const filename = `users-${new Date().toISOString().substring(0, 10)}.json`;
  const jsonStr = JSON.stringify(rows.value);

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function resetForm() {
  formData.value = {
    Name: undefined,
    Surname: undefined,
    Email: undefined,
    Age: undefined,
    FavoriteColor: undefined,
    ContactPreference: []
  }
  fieldErrors.value = {}
}

async function deleteItem(index: number) {
  try {
    const userId = rows.value[index].id
    if (!userId) throw new Error('No user ID found')

    await api.deleteUser(userId)
    rows.value.splice(index, 1)
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Unknown error'
  }
}
</script>

<template>
  <main>
    <CrudTable :headers="headers"
               :rows="rows"
               :valid-form="validForm"
               :error-message="errorMessage"
               @update:export="exportJSON()"
               @update:create="create()"
               @update:preview="preview"
               @update:edit="update"
               @update:close-modal="resetForm()"
               @update:remove="deleteItem($event)">
      <div class="z-row">
        <label for="name">Name</label>
        <input v-model.trim="formData.Name"
               id="name"
               type="text"
        class="z-input">
      </div>
      <div class="z-row">
        <label for="surname">Surname</label>
        <input v-model.trim="formData.Surname"
               id="surname"
               type="text"
        class="z-input">
      </div>
      <div class="z-row">
        <label for="email">Email<span class="required">*</span></label>
        <input v-model.trim="formData.Email"
               id="email"
               type="email"
               class="z-input"
               @input="validateField('Email', validators.email, 'Invalid Email address')">
        <div class="error-msg">{{fieldErrors?.Email}}</div>
      </div>
      <div class="z-row">
        <label for="age">Age<span class="required">*</span></label>
        <input v-model.number="formData.Age"
               id="age"
               type="number"
               class="z-input"
               min="0"
               @input="validateField('Age', validators.age, 'Age must be a number between 0 and 120')">
        <div class="error-msg">{{fieldErrors?.Age}}</div>
      </div>
      <div class="z-row">
        <label for="favorite_color">Favorite color</label>
        <select id="favorite_color" v-model="formData.FavoriteColor" class="z-input">
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </div>

      <div>Contact Preference<span class="required">*</span></div>
      <div class="horizontal-row">
        <input v-model="formData.ContactPreference"
               type="checkbox"
               value="email"
               id="checkbox_email"
               @change="validateField('ContactPreference', validators.contactPreference, 'Select at least 1 option')">
        <label for="checkbox_email">email</label>
      </div>
      <div class="horizontal-row">
        <input v-model="formData.ContactPreference"
               type="checkbox"
               value="phone_call"
               id="checkbox_phone_call"
               @change="validateField('ContactPreference', validators.contactPreference, 'Select at least 1 option')">
        <label for="checkbox_phone_call">phone_call</label>
      </div>
      <div class="horizontal-row">
        <input v-model="formData.ContactPreference"
               type="checkbox"
               value="sms"
               id="checkbox_sms"
               @change="validateField('ContactPreference', validators.contactPreference, 'Select at least 1 option')">
        <label for="checkbox_sms">sms</label>
      </div>
      <div class="error-msg">{{fieldErrors?.ContactPreference}}</div>

      <template #exportModal>
        <code>
          <pre>{{ JSON.stringify(rows.map(({ id, ...rest }) => rest), null, 2) }}</pre>
        </code>
      </template>
    </CrudTable>
  </main>
</template>

<style lang="scss" scoped>
.error-msg {
  color: red;
}

.z-row {
  margin-bottom: 8px;

  > label {
    display: block;
  }
}

.horizontal-row {
  display: flex;
  align-items: center;

  input[type=checkbox] {
    margin-right: 4px;
  }
}

.required {
  color: red;
}
</style>
