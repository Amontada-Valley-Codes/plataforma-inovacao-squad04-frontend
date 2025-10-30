import { Calendar, Check, CircleUserRound, Heart, Loader2, SquarePen, Tag, Trash2, X } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import { dateFormatter, getCategoryLabel, shortDateFormatter } from "./Kanban";
import { ShowAllChecklistsResponse } from "@/api/payloads/checklist.payload";
import { checklistService } from "@/api/services/checklist.service";
import { cn } from "@/lib/utils";
import { ShowAllTagsResponse } from "@/api/payloads/tags.payload";
import { tagsService } from "@/api/services/tags.service";
import { ShowAllIdeiasResponse } from "@/api/payloads/ideia.payload";
import { ideiaService } from "@/api/services/ideia.service";

type CardContentsHeaderProps = {
  challengeTitle?: string;
  category?: string;
  creator?: string;
  startDate?: string;
  endDate?: string;
  visibility?: string;
}

export const getVisibilityLabel = (visibility: string) => {
  switch (visibility) {
    case "PUBLIC":
      return "PÚBLICO"
    case "PRIVATE":
    default:
      return "PRIVADO"
    case "INTERNAL":
      return "PRIVADO"
  }
}

export const toTitleCase = (text: string): string => {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const CardContentsHeader = ({ challengeTitle, category, creator, startDate, endDate, visibility }: CardContentsHeaderProps) => {

  return (
    <div className="mb-4">
      <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-1">{challengeTitle}</h1>
      <div className="flex gap-2 mb-2">
        {category && (
          <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
            {getCategoryLabel(category)}
          </button>
        )}

        {visibility && (
          <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
            {getVisibilityLabel(visibility)}
          </button>
        )}
      </div>

      <div className="flex gap-4 text-gray-600">
        {endDate && startDate && (
          <div className="flex items-center gap-2">
            <Calendar size={16}/>
            <p>
              {shortDateFormatter.format(new Date(startDate))} -{" "}
              {dateFormatter.format(new Date(endDate))}
            </p>
          </div>
        )}
        {creator && (
          <div className="flex items-center gap-2">
            <CircleUserRound size={20}/>
            <p>{toTitleCase(creator)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

type RatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  initialScore?: number;
};

export const Rating = ({ className, value, onChange, initialScore = 0 }: RatingProps) => {
  const [score, setScore] = useState(initialScore);
  const ratingOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (value !== undefined) setScore(Number(value));
  }, [value]);

  const handleClick = (num: number) => {
    setScore(num);
    onChange?.(num);
  };

  return (
    <div className={cn("mt-3 flex items-center gap-3", className)}>
      {ratingOptions.map((num, i) => (
        <div key={i} className="flex flex-col justify-center items-center gap-[2px]">
          <p className="text-[10px]">{num}</p>
          <button
            type="button"
            key={num}
            value={num}
            onClick={() => handleClick(num)}
            className={`h-5 w-5 rounded-full flex items-center justify-center 
            font-semibold text-sm transition-all duration-200 bg-[#F9FAFB] border border-[#E5E7EB] focus:outline-none 
            focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
          >
            <div className={`h-3 w-3 rounded-full ${
              num === score ? "bg-[#0B2B72]" : ""
            }`}>

            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export const ProgressBarActions = ({percentage}: {percentage: number}) => {
  return (
    <div className="mb-6">
      <div>
        <p className="text-green-600 font-bold text-sm">
          {percentage}% <span className="text-[#666]">Aprovado</span>
        </p>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

type TagsProps = {
  challengeId: string
  category: string
}

export const Tags = ({ category, challengeId }: TagsProps) => {
  const [tags, setTags] = useState<ShowAllTagsResponse[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [editingTag, setEditingTag] = useState("")
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await tagsService.showAllTags(challengeId)
        console.log(response)
        setTags(response)
      } catch (error: any) {
        console.error("Erro ao buscar tags:", error)
        setError("Erro ao carregar tags.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [challengeId])

  const addTag = async (challengeId: string, newTag: string) => {
    if (newTag.trim() === "") return
    setError(null)
    try {
      const response = await tagsService.createTag(challengeId, { tag: newTag })
      setTags((prev) => [...prev, response])
      setNewTag("")
    } catch (error: any) {
      console.error(error)
      setError("Erro ao adicionar tag.")
    }
  }

  const updateTag = async (tagId: string, newTag: string) => {
    setError(null)
    try {
      const response = await tagsService.updateTag(tagId, { tag: newTag })
      setTags((prev) => 
        prev.map((tag) =>
          tag.id === tagId ? {...tag, tag: response.tag} : tag
        )
      )
      setEditingTagId(null)
      setEditingTag("")
    } catch (error: any) {
      console.error(error)
      setError("Erro ao atualizar tag.")
    }
  }

  const deleteTag = async (tagId: string) => {
    setError(null)
    try {
      await tagsService.deleteTag(tagId)
      setTags((prev) => prev.filter((tag) => tag.id !== tagId))
    } catch (error: any) {
      console.error(error)
      setError("Erro ao deletar tag.")
    }
  }

  if (error) {
    return <div className="w-full justify-center items-center h-full">
      {error}
    </div>
  }

  if (isLoading) {
    return <div className="w-full justify-center items-center h-full">
      <Loader2 size={24} className="animate-spin"/>
    </div>
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center w-full bg-[#D9D9D9] text-[#D9D9D9] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
        <Tag fill="#666" size={16}/>
        <p className="text-[#666]">TAGS</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-[rgb(11,43,112)] text-[12px] text-[#0B2B70] font-semibold w-fit rounded-[8px] px-3 py-1">
          {getCategoryLabel(category)}
        </div>
        {tags.map((tag) => (
          <div key={tag.id}>
            {editingTagId === tag.id ? (
              <div className="flex gap-2 items-center">
                <input 
                  key={tag.id}
                  value={editingTag}
                  onChange={(e) => setEditingTag(e.target.value)}
                  onBlur={(e) => {
                    const relatedTarget = e.relatedTarget as HTMLElement | null
                    const isDeleteButton = relatedTarget?.dataset?.role === "delete-button"

                    if (isDeleteButton) return 

                    if (editingTag !== tag.tag) {
                      updateTag(tag.id, editingTag)
                    } else {
                      setEditingTag("")
                      setEditingTagId(null)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateTag(tag.id, editingTag)
                    } if (e.key === "Escape") {
                      setEditingTag("")
                      setEditingTagId(null)
                    }
                  }}
                  className="border border-[rgb(11,43,112)] text-[12px] 
                  text-[#0B2B70] font-semibold w-fit rounded-[8px] px-3 py-1"
                  autoFocus
                />

                <button
                  data-role="delete-button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteTag(tag.id)
                    setEditingTagId(null) 
                    setEditingTag("")
                  }}
                >
                  <Trash2
                    size={16}
                    className="text-red-600 hover:text-red-800 transition-all 
                    duration-300 ease-in-out"
                  />
                </button>
              </div>
            ) : (
              <div 
                key={tag.id}
                onClick={() => {
                  setEditingTag(tag.tag)
                  setEditingTagId(tag.id)
                }} 
                className="border border-[rgb(11,43,112)] text-[12px] 
                text-[#0B2B70] font-semibold w-fit rounded-[8px] px-3 py-1"
              >
                {tag.tag.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nova Tag..."
            className="flex-1 px-3 py-1.5 text-sm rounded-md border ml-1 border-gray-300 focus:outline-none focus:ring focus:ring-[#0B2B72]"
          />

          <button
            onClick={() => {
              addTag(challengeId, newTag)
              setIsAdding(false)
            }}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-[8px] text-[#666] bg-[#E2E2E2] hover:bg-gray-300 transition"
          >
            Adicionar
          </button>
        </div>
      )}

      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-1 w-fit px-2 py-1.5 text-sm text-[#666] 
        bg-[#E2E2E2] hover:bg-gray-300 rounded-[8px] transition"
      >
        Adicionar Tag
      </button>
    </div>
  )
}

type IdeaisProps = {
  challengeId: string
}

export const Ideias = ({ challengeId }: IdeaisProps) => {
  const [ideias, setIdeias] = useState<ShowAllIdeiasResponse['ideas']>([])
  const [newIdeia, setNewIdeia] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>()

  const fetchIdeias = useCallback(async () => {
    setError(null)
    try {
      const response = await ideiaService.showIdeias(challengeId)
      setIdeias(response.ideas)
      console.log(response.ideas)
    } catch (error: any) {
      console.error(error)
      setError("Erro ao carregar sugestões.")
    }
  }, [challengeId])

  useEffect(() => {
    const loadIdeias = async () => {
      setIsLoading(true)
      await fetchIdeias()
      setIsLoading(false)
    }
    loadIdeias()
  }, [fetchIdeias])

  const handleLike = async (ideiaId: string) => {
    setError(null)
    try {
      await ideiaService.likeIdeia(ideiaId)
      await fetchIdeias()
    } catch (error: any) {
      console.error(error)
      setError("Erro ao registrar curtida.")
    }
  }

  const handleApprove = async (ideiaId: string) => {
    setError(null)
    try {
      await ideiaService.approveIdeia(ideiaId)
      await fetchIdeias()
    } catch (error: any) {
      console.log(error)
      setError("Erro ao aprovar sugestão.")
    }
  }

  const handleReject = async (ideiaId: string) => {
    setError(null)
    try {
      await ideiaService.rejectIdeia(ideiaId)
      await fetchIdeias()
    } catch (error: any) {
      console.error(error)
      setError("Erro ao rejeitar sugestão.")
    }
  }

  const addIdeia = async (challengeId: string, ideia: string) => {
    setError(null)
    try {
      await ideiaService.createIdeia(challengeId, { ideia })
      setNewIdeia("")
      await fetchIdeias()
    } catch (error: any) {
      console.error(error)
      setError("Erro ao adicionar sugestão.")
    }
  }

  const deleteIdea = async (ideiaId: string) => {
    setError(null)
    try {
      await ideiaService.deleteIdeia(ideiaId)
      await fetchIdeias()
    } catch (error: any) {
      console.error(error)
      setError("Erro ao deletar sugestão.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-300";
      case "APPROVED": return "bg-green-500";
      case "REJECTED": return "bg-red-500";
      default: return "bg-gray-300";
    }
  }

  const getStatusTitle = (status: string) => {
     switch (status) {
      case "PENDING": return "Pendente";
      case "APPROVED": return "Aprovado";
      case "REJECTED": return "Reprovado";
      default: return "Desconhecido";
    }
  }

  if (error) {
    return <div className="w-full justify-center items-center h-full">
      {error}
    </div>
  }

  if (isLoading) {
    return <div className="w-full justify-center items-center h-full">
      <Loader2 size={24} className="animate-spin"/>
    </div>
  }

  return (
    <div className="flex items-start flex-col w-full gap-3 py-3">   
      {ideias.map((ideia) => (
        <div className="flex- w-full" key={ideia.id}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-base text-[#0B2B72]">{toTitleCase(ideia.userName)}</span>

              <div 
                className={`h-2 w-2 rounded-full ${getStatusColor(ideia.status)}`}
                title={getStatusTitle(ideia.status)}
              />
            </div>

            <Trash2
              onClick={() => deleteIdea(ideia.id)}
              size={16}
              className="text-red-600 hover:text-red-800 transition-all 
              duration-300 ease-in-out"
            />
          </div>
          <p className="text-base text-gray-600">{ideia.ideia}</p>
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1 items-center">
              <Heart
                size={18}
                onClick={() => handleLike(ideia.id)}
                className={`text-[#666] cursor-pointer`}
              />
              <span
                className={`text-sm text-[#666]`}
              >
                {ideia.likesCount}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleReject(ideia.id)}
                className="w-26 px-2 py-1 rounded-md font-semibold text-sm border border-[#0B2B72] text-[#0B2B72]"
              >
                Rejeitar
              </button>

              <button
                onClick={() => handleApprove(ideia.id)}
                className="w-26 px-2 py-1 rounded-md font-semibold text-white text-sm bg-[#0B2B72]"
              >
                Aprovar
              </button>
            </div>
          </div>
        </div>
      ))}
      {isAdding && (
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={newIdeia}
            onChange={(e) => setNewIdeia(e.target.value)}
            placeholder="Nova sugestão.."
            className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none ml-1 focus:ring focus:ring-[#0B2B72]"
          />
          <button
            onClick={() => {
              addIdeia(challengeId, newIdeia)
              setIsAdding(false)
            }}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-[8px] text-[#666] bg-[#E2E2E2] hover:bg-gray-300 transition"
          >
            Adicionar
          </button>
        </div>
      )}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-[#666] 
          bg-[#E2E2E2] hover:bg-gray-300 rounded-[8px] transition mt-4"
        >
          Adicionar Sugestão
        </button>
      )}
    </div>
  );
};


type ChecklistProps = {
  challengeId: string;
}

export const Checklist = ({ challengeId }: ChecklistProps) => {
  const [items, setItems] = useState<ShowAllChecklistsResponse[]>([])
  const [newItem, setNewItem] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    async function fetchChecklists() {
      const response = await checklistService.showAllChecklists(challengeId)
      setItems(response)
    }

    fetchChecklists()
  }, [challengeId])

  const toggleItem = async (checklistId: string) => {
    try {
      const updatedChecklist = await checklistService.updateStatusChecklist(checklistId)

      setItems((prev) => 
        prev.map((item) =>
          item.id === checklistId ? {...item, completed: updatedChecklist.completed} : item
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addItem = async (challengeId: string, checklistText: string) => {
    try {
      const newChecklist = await checklistService.createChecklist(challengeId, { text: checklistText })
      setItems((prev) => [...prev, newChecklist])
      setNewItem('') 
    } catch (error) {
      console.error(error)
    }
  }

  const updateItem = async (checklistId: string, newChecklistText: string) => {
    try {
      const updatedChecklist = await checklistService.updateChecklist(checklistId, { text: newChecklistText })

      setItems((prev) => 
        prev.map((item) =>
          item.id === checklistId ? {...item, text: updatedChecklist.text} : item
        )
      )
      setEditingText('')
    } catch (error) {
      console.error(error)
    }
  }

  const deleteItem = async (checklistId: string) => {
    try {
      await checklistService.deleteChecklist(checklistId)

      setItems((prev) => prev.filter((item) => item.id !== checklistId))
    } catch (error) {
      console.error(error)
    }
  }

  if (error) {
    return <div className="w-full justify-center items-center h-full">
      {error}
    </div>
  }

  if (isLoading) {
    return <div className="w-full justify-center items-center h-full">
      <Loader2 size={24} className="animate-spin"/>
    </div>
  }

  return (
    <div className="w-full">

      <div className="flex flex-col gap-2 w-full">
        {items.map(item => (   
          <div key={item.id} className="flex items-center gap-2 text-sm  mt-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="w-4 h-4 accent-gray-600 rounded"
            />
            <div className="flex items-center w-[60%] gap-2 justify-between">
              {editingId === item.id ? (
                <>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => {
                      setEditingId(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editingText.trim()) updateItem(item.id, editingText)
                        setEditingId(null)
                      }
                      if (e.key === 'Escape') {
                        setEditingId(null)
                        setEditingText('')
                      }
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      if (editingText.trim()) updateItem(item.id, editingText)
                    }} 
                    className="p-2 text-green-600 hover:text-green-800" 
                    title="Salvar"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => setEditingId(null)} 
                    className="p-2 text-gray-600 hover:text-gray-800" 
                    title="Cancelar"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className={item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}>
                    {item.text}
                  </span>
                  <div className="relative flex h-5 items-end gap-2">
                    <button title="Editar Item">
                      <SquarePen 
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(item.id)
                          setEditingText(item.text)
                        }}
                        size={16}
                        className="text-[#0B2B72] 
                        hover:text-[#0b245a] transition-all duration-300 ease-in-out"
                      />
                    </button>
                    <button title="Excluir Item">
                      <Trash2
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteItem(item.id)
                        }} 
                        size={16}
                        className="text-red-600 hover:text-red-800 transition-all 
                        duration-300 ease-in-out"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Novo item..."
            className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none ml-1 focus:ring focus:ring-[#0B2B72]"
          />
          <button
            onClick={() => {
              addItem(challengeId, newItem)
              setIsAdding(false)
            }}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-[8px] text-[#666] bg-[#E2E2E2] hover:bg-gray-300 transition"
          >
            Adicionar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-[#666] bg-[#E2E2E2] hover:bg-gray-300 rounded-[8px] transition mt-4"
        >
          Adicionar Item
        </button>
      )}
    </div>
  )
}