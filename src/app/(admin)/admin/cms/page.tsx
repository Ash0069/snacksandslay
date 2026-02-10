'use client';

import { useRouter } from "next/navigation";
import { type SubmitEvent, useCallback, useEffect, useRef, useState } from "react";
import CmsCategoryManager from "@/components/admin/cms/CmsCategoryManager";
import CmsDeleteConfirmModal from "@/components/admin/cms/CmsDeleteConfirmModal";
import CmsHeader from "@/components/admin/cms/CmsHeader";
import CmsItemForm, { type MenuFormState } from "@/components/admin/cms/CmsItemForm";
import CmsItemsList from "@/components/admin/cms/CmsItemsList";
import CmsPageContainer from "@/components/admin/cms/CmsPageContainer";
import CmsStateMessage from "@/components/admin/cms/CmsStateMessage";
import CmsToast from "@/components/admin/cms/CmsToast";
import type { MenuItem } from "@/lib/menuData";

const EMPTY_FORM: MenuFormState = {
  name: "",
  price: "",
  category: "",
  description: "",
  bestSeller: false,
};

export default function CmsPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadItems = useCallback(async () => {
    const response = await fetch("/api/admin/menu", { cache: "no-store" });

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!response.ok) {
      setError("Failed to load menu items.");
      return;
    }

    const data = (await response.json()) as { items: MenuItem[]; categories: string[] };
    setItems(data.items);
    setCategories(data.categories);
  }, [router]);

  useEffect(() => {
    const bootstrap = async () => {
      const sessionResponse = await fetch("/api/admin/session", { cache: "no-store" });
      const sessionData = (await sessionResponse.json().catch(() => null)) as
        | { authenticated?: boolean }
        | null;

      if (!sessionData?.authenticated) {
        router.replace("/admin/login");
        return;
      }

      await loadItems();
      setLoading(false);
    };

    void bootstrap();
  }, [loadItems, router]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleFormChange = <K extends keyof MenuFormState>(
    field: K,
    value: MenuFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category || !form.description) {
      return;
    }

    setSubmitting(true);

    if (editingId) {
      const response = await fetch(`/api/admin/menu/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        setError("Failed to update menu item.");
        setSubmitting(false);
        return;
      }

      const data = (await response.json()) as { item: MenuItem };
      setItems((prev) => prev.map((item) => (item.id === editingId ? data.item : item)));
      resetForm();
      setSubmitting(false);
      return;
    }

    const response = await fetch("/api/admin/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!response.ok) {
      setError("Failed to add menu item.");
      setSubmitting(false);
      return;
    }

    const data = (await response.json()) as { item: MenuItem };
    setItems((prev) => [data.item, ...prev]);
    resetForm();
    setSubmitting(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      bestSeller: item.bestSeller,
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 2600);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setError("");
    const response = await fetch(`/api/admin/menu/${deleteTarget.id}`, {
      method: "DELETE",
    });

    if (response.status === 401) {
      router.replace("/admin/login");
      setDeleting(false);
      return;
    }

    if (!response.ok) {
      setError("Failed to delete menu item.");
      setDeleting(false);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));

    if (editingId === deleteTarget.id) {
      resetForm();
    }

    setDeleteTarget(null);
    setDeleting(false);
    showToast("Menu item deleted successfully.");
  };

  const handleDeleteRequest = (item: MenuItem) => {
    setDeleteTarget(item);
  };

  const handleCreateCategory = async (name: string) => {
    setError("");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to create category.");
      return;
    }

    const data = (await response.json()) as { category: string };
    setCategories((prev) => Array.from(new Set([...prev, data.category])).sort());
    showToast("Category created successfully.");
  };

  const handleDeleteCategory = async (name: string) => {
    setError("");
    setDeletingCategory(name);

    const response = await fetch(`/api/admin/categories/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });

    if (response.status === 401) {
      router.replace("/admin/login");
      setDeletingCategory(null);
      return;
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to delete category.");
      setDeletingCategory(null);
      return;
    }

    setCategories((prev) => prev.filter((category) => category !== name));
    if (form.category === name) {
      setForm((prev) => ({ ...prev, category: "" }));
    }
    setDeletingCategory(null);
    showToast("Category deleted successfully.");
  };

  const handleDeleteCancel = () => {
    if (deleting) {
      return;
    }

    setDeleteTarget(null);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  if (loading) {
    return <CmsStateMessage message="Loading CMS..." />;
  }

  return (
    <CmsPageContainer>
      <CmsHeader onLogout={handleLogout} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-6">
          <CmsItemForm
            form={form}
            editingId={editingId}
            categories={categories}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
            onFormChange={handleFormChange}
            onCancel={resetForm}
          />
          <CmsCategoryManager
            categories={categories}
            deletingCategory={deletingCategory}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
        <CmsItemsList items={items} onEdit={handleEdit} onDeleteRequest={handleDeleteRequest} />
      </div>

      <CmsDeleteConfirmModal
        item={deleteTarget}
        deleting={deleting}
        onCancel={handleDeleteCancel}
        onConfirm={handleDelete}
      />
      <CmsToast message={toastMessage} />
    </CmsPageContainer>
  );
}
