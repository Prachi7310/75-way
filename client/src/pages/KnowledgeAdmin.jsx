import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getKnowledge,
  searchKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from "../services/knowledge";

const categories = [
  "about",
  "service",
  "internship",
  "training",
  "career",
  "contact",
  "technology",
  "faq",
  "policy",
  "other",
];

const emptyForm = {
  title: "",
  category: "other",
  content: "",
  keywords: "",
  status: true,
};

export default function KnowledgeAdmin() {
  const [knowledge, setKnowledge] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // =====================================
  // Load Knowledge
  // =====================================

  const loadKnowledge = async () => {
    try {
      setLoading(true);

      const data = await getKnowledge();

      setKnowledge(data?.knowledge || []);
    } catch (error) {
      console.error("Load Knowledge Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load knowledge"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, []);

  // =====================================
  // Search
  // =====================================

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      loadKnowledge();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const data = await searchKnowledge(query);

        setKnowledge(data?.knowledge || []);
      } catch (error) {
        console.error("Knowledge Search Error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Search failed"
        );
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // =====================================
  // Open Add Modal
  // =====================================

  const handleAdd = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setShowModal(true);
  };

  // =====================================
  // Open Edit Modal
  // =====================================

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      category: item.category || "other",
      content: item.content || "",
      keywords: Array.isArray(item.keywords)
        ? item.keywords.join(", ")
        : "",
      status:
        typeof item.status === "boolean"
          ? item.status
          : true,
    });

    setShowModal(true);
  };

  // =====================================
  // Close Modal
  // =====================================

  const handleClose = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // =====================================
  // Form Change
  // =====================================

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================
  // Save Knowledge
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),

        category: form.category,

        content: form.content.trim(),

        keywords: form.keywords
          .split(",")
          .map((keyword) =>
            keyword.trim().toLowerCase()
          )
          .filter(Boolean),

        status: form.status,
      };

      if (editingId) {
        await updateKnowledge(
          editingId,
          payload
        );

        toast.success(
          "Knowledge updated successfully"
        );
      } else {
        await createKnowledge(payload);

        toast.success(
          "Knowledge added successfully"
        );
      }

      handleClose();

      await loadKnowledge();
    } catch (error) {
      console.error(
        "Save Knowledge Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save knowledge"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // Delete Knowledge
  // =====================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this knowledge?"
    );

    if (!confirmed) return;

    try {
      await deleteKnowledge(id);

      setKnowledge((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Knowledge deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Knowledge Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete knowledge"
      );
    }
  };

  // =====================================
  // Toggle Status
  // =====================================

  const handleToggleStatus = async (item) => {
    try {
      await updateKnowledge(item._id, {
        status: !item.status,
      });

      setKnowledge((prev) =>
        prev.map((knowledgeItem) =>
          knowledgeItem._id === item._id
            ? {
                ...knowledgeItem,
                status: !knowledgeItem.status,
              }
            : knowledgeItem
        )
      );

      toast.success(
        item.status
          ? "Knowledge deactivated"
          : "Knowledge activated"
      );
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* =====================================
            Header
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600">
                <BookOpen size={22} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Knowledge Base
                </h1>

                <p className="text-slate-400 mt-1">
                  Manage the knowledge used by BN Technology AI
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            <Plus size={18} />
            Add Knowledge
          </button>

        </div>

        {/* =====================================
            Search
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search knowledge..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-11 py-3.5 text-white outline-none focus:border-blue-500 transition"
            />

            {searching && (
              <Loader2
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-spin"
              />
            )}

            {!searching && search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={18} />
              </button>
            )}

          </div>

        </div>

        {/* =====================================
            Stats
        ===================================== */}

        <div className="grid sm:grid-cols-3 gap-4 mb-6">

          <StatCard
            title="Total Knowledge"
            value={knowledge.length}
            icon={<BookOpen size={19} />}
          />

          <StatCard
            title="Active"
            value={
              knowledge.filter(
                (item) => item.status
              ).length
            }
            icon={<CheckCircle2 size={19} />}
          />

          <StatCard
            title="Inactive"
            value={
              knowledge.filter(
                (item) => !item.status
              ).length
            }
            icon={<XCircle size={19} />}
          />

        </div>

        {/* =====================================
            Knowledge List
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="font-semibold text-lg">
              Knowledge Entries
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {knowledge.length} entries found
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2
                size={30}
                className="animate-spin text-blue-500"
              />
            </div>
          ) : knowledge.length === 0 ? (
            <div className="py-20 text-center">

              <BookOpen
                size={42}
                className="mx-auto text-slate-700 mb-4"
              />

              <p className="text-slate-400">
                No knowledge found
              </p>

              <button
                onClick={handleAdd}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
              >
                Add your first knowledge entry
              </button>

            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {knowledge.map((item) => (

                <div
                  key={item._id}
                  className="p-6 hover:bg-slate-800/30 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">

                    {/* Content */}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>

                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs capitalize">
                          {item.category || "other"}
                        </span>

                        {item.status ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs">
                            <CheckCircle2 size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs">
                            <XCircle size={12} />
                            Inactive
                          </span>
                        )}

                      </div>

                      <p className="text-slate-400 text-sm leading-6 whitespace-pre-wrap">
                        {item.content}
                      </p>

                      {/* Keywords */}

                      {item.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">

                          {item.keywords.map(
                            (keyword, index) => (
                              <span
                                key={`${keyword}-${index}`}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                              >
                                #{keyword}
                              </span>
                            )
                          )}

                        </div>
                      )}

                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2 lg:pt-1">

                      <button
                        onClick={() =>
                          handleToggleStatus(item)
                        }
                        className={`p-2.5 rounded-lg transition ${
                          item.status
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-slate-500 hover:bg-slate-800"
                        }`}
                        title={
                          item.status
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        {item.status ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="p-2.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

      {/* =====================================
          Add / Edit Modal
      ===================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">

              <div>
                <h2 className="text-xl font-bold">
                  {editingId
                    ? "Edit Knowledge"
                    : "Add Knowledge"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  This information can be used by BN Technology AI
                </p>
              </div>

              <button
                onClick={handleClose}
                disabled={saving}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Title */}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. BN Technology Internship Program"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Category */}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition capitalize"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Content */}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content
                </label>

                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Write the detailed information here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-y"
                />
              </div>

              {/* Keywords */}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Keywords
                </label>

                <input
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="internship, training, student, career"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                />

                <p className="text-xs text-slate-500 mt-2">
                  Separate keywords using commas.
                </p>
              </div>

              {/* Status */}

              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">

                <div>
                  <p className="font-medium">
                    Active Knowledge
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    AI will use active knowledge during responses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      status: !prev.status,
                    }))
                  }
                  className={`w-12 h-6 rounded-full relative transition ${
                    form.status
                      ? "bg-blue-600"
                      : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                      form.status
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition font-medium"
                >
                  {saving ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Knowledge"
                    : "Save Knowledge"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}

// =====================================
// Stat Card
// =====================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-bold mt-1">
            {value}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

      </div>

    </div>
  );
}