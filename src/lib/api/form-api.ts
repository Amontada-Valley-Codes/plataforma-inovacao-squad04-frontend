import { 
  FormTemplate, 
  FormTemplateVersion, 
  QuestionForm,
  CreateFormTemplateDto,
  CreateFormTemplateVersionDto,
  CreateQuestionFormDto,
  UpdateQuestionFormDto,
  ReorderQuestionsDto
} from '@/lib/types/form-api'

// Form Template endpoints
export async function createFormTemplate(data: CreateFormTemplateDto): Promise<FormTemplate> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to create form template: ${response.status} ${errorText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

// Form Template Version endpoints
export async function createFormTemplateVersion(data: CreateFormTemplateVersionDto): Promise<FormTemplateVersion> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-template-versions/${data.templateId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      console.error('Attempted URL:', `${process.env.NEXT_PUBLIC_API_URL}/form-template-versions/${data.templateId}`)
      throw new Error(`Failed to create form template version: ${response.status} ${errorText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function getFormTemplateVersions(templateId: string): Promise<FormTemplateVersion[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-template-versions/template/${templateId}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to fetch form template versions: ${response.status} ${errorText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function activateFormTemplateVersion(id: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-template-versions/${id}/activate`, {
      method: 'PUT'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to activate form template version: ${response.status} ${errorText}`)
    }
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function deactivateFormTemplateVersion(id: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-template-versions/${id}/deactivate`, {
      method: 'PUT'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to deactivate form template version: ${response.status} ${errorText}`)
    }
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function deleteFormTemplateVersion(id: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-template-versions/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to delete form template version: ${response.status} ${errorText}`)
    }
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

// Question Form endpoints
export async function createQuestionForm(data: CreateQuestionFormDto): Promise<QuestionForm> {
  try {
    const requestBody: any = {
      title: data.title,
      type: data.type,
      required: data.required
    }
    
    if (data.options) {
      requestBody.options = data.options
    }
    
    console.log('Sending to API:', requestBody)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-forms/${data.versionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to create question form: ${response.status} ${errorText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function getQuestionsByVersion(versionId: string): Promise<QuestionForm[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-forms/version/${versionId}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to fetch questions: ${response.status} ${errorText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function updateQuestionForm(id: string, data: UpdateQuestionFormDto): Promise<QuestionForm> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to update question form: ${response.status} ${errorText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function deleteQuestionForm(id: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-forms/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to delete question form: ${response.status} ${errorText}`)
    }
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}

export async function reorderQuestions(data: ReorderQuestionsDto): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-forms/questions/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Failed to reorder questions: ${response.status} ${errorText}`)
    }
  } catch (error) {
    console.error('Network Error:', error)
    throw error
  }
}