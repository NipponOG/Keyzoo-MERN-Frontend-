'use client';

import { useEffect, useRef, useState } from 'react';
import adminFetch from '@/lib/adminFetch';

const emptyRequirement = {
    os: '',
    processor: '',
    memory: '',
    graphics: '',
    storage: '',
    sound: '',
    additional_notes: '',
};

const emptyForm = {
    title: '',
    slug: '',
    var_title: '',

    category: '',
    subCategory: '',
    platform: '',
    workPlatform: '',

    item: 'DIGITAL KEY',
    item_type: 'GAME',

    price: '',
    discountPrice: '',
    currency: 'INR',

    region: '',
    card_region: '',

    notice: '',
    description: '',
    descriptionkey: '',

    publisher: '',
    developer: '',
    releaseDate: '',
    editiondescription: '',
    age: '',

    minimumRequirement: { ...emptyRequirement },
    recommendedRequirement: { ...emptyRequirement },

    audio_language: '',
    interface_language: '',
    subtitles_language: '',

    image: '',
    gallery: '',
    platform_image: '',
    platform_icon_image: '',

    status: 'draft',

    available: false,
    isBestSeller: false,
    isRecommended: false,
    psn: false,

    rating: '0',

    relatedProducts: '',

    seo: '',
    Tags: '',
};

const inputClass = `
    h-11 w-full
    rounded-xl
    border border-[#32343a]
    bg-[#232323]
    px-3.5
    text-sm
    text-white
    outline-none
    placeholder:text-gray-500
    transition
    focus:border-indigo-500
    focus:ring-2
    focus:ring-indigo-500/20
`;

const textareaClass = `
    min-h-[110px] w-full
    resize-y
    rounded-xl
    border border-[#32343a]
    bg-[#232323]
    px-3.5 py-3
    text-sm
    text-white
    outline-none
    placeholder:text-gray-500
    transition
    focus:border-indigo-500
    focus:ring-2
    focus:ring-indigo-500/20
`;

function normalizeImage(value) {
    if (!value) return '';

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        return (
            value.url ||
            value.thumbnail ||
            value.small ||
            value.medium ||
            value.large ||
            ''
        );
    }

    return '';
}

function normalizeArray(value) {
    if (!Array.isArray(value)) return '';

    return value.join(', ');
}

function normalizeRequirement(value) {
    return {
        ...emptyRequirement,
        ...(value || {}),
    };
}

function parseCommaSeparated(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function parseJson(value) {
    if (!value?.trim()) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        throw new Error('SEO must contain valid JSON.');
    }
}

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    required = false,
    min,
    max,
    step,
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">
                {label}
                {required && (
                    <span className="ml-1 text-red-400">*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                step={step}
                className={inputClass}
            />
        </div>
    );
}

function SelectField({
    label,
    name,
    value,
    onChange,
    options,
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">
                {label}
            </label>

            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className={`${inputClass} cursor-pointer`}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#232323]"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function TextareaField({
    label,
    name,
    value,
    onChange,
    placeholder,
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">
                {label}
            </label>

            <textarea
                name={name}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                className={textareaClass}
            />
        </div>
    );
}

function Section({
    title,
    description,
    children,
}) {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="mb-5">
                <h3 className="text-sm font-semibold text-white">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </section>
    );
}

function ImagePreview({ src, alt, className = '' }) {
    if (!src) return null;

    return (
        <div
            className={`
                relative
                overflow-hidden
                rounded-xl
                border border-white/10
                bg-[#141414]
                ${className}
            `}
        >
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-contain p-2"
            />
        </div>
    );
}

function RequirementFields({
    value,
    onChange,
    prefix,
}) {
    const fields = [
        ['os', 'OS', 'Windows 10 / 11'],
        ['processor', 'Processor', 'Intel Core i5'],
        ['memory', 'Memory', '16 GB RAM'],
        ['graphics', 'Graphics', 'GTX 1060 / RX 580'],
        ['storage', 'Storage', '70 GB available space'],
        ['sound', 'Sound', 'DirectX compatible'],
        [
            'additional_notes',
            'Additional Notes',
            'Additional requirements',
        ],
    ];

    return (
        <div className="space-y-3">
            {fields.map(([field, label, placeholder]) => (
                <div key={field}>
                    <label className="mb-1.5 block text-[11px] font-medium text-gray-500">
                        {label}
                    </label>

                    <input
                        type="text"
                        value={value?.[field] ?? ''}
                        onChange={(e) =>
                            onChange(
                                prefix,
                                field,
                                e.target.value
                            )
                        }
                        placeholder={placeholder}
                        className={inputClass}
                    />
                </div>
            ))}
        </div>
    );
}

export default function EditProductModal({ open, product, onClose, onUpdated, }) {

    const isGiftCard = product?.type === 'gift-card';
    const resourceName = isGiftCard ? 'Gift Card' : 'Product';

    const [form, setForm] = useState(emptyForm);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploading, setUploading] = useState({});

    const [variations, setVariations] = useState([]);
    const [variationsLoading, setVariationsLoading] = useState(false);
    const [variationsError, setVariationsError] = useState('');
    const [showAddVariation, setShowAddVariation] = useState(false);
    const [addingVariation, setAddingVariation] = useState(false);

    const [variationForm, setVariationForm] = useState({
        title: '',
        slug: '',
        var_title: '',
        region: '',
        price: '',
        discountPrice: '',
    });

    const mainImageInputRef = useRef(null);
    const platformImageInputRef = useRef(null);
    const platformIconInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const loadVariations = async () => {
        const groupId = isGiftCard
            ? product?.giftCardGroupId
            : product?.productGroupId;

        if (!groupId) {
            setVariations([]);
            return;
        }

        setVariationsLoading(true);
        setVariationsError('');

        try {
            const endpoint = isGiftCard
                ? `/admin/gift-cards/group/${groupId}`
                : `/admin/products/group/${groupId}`;

            const data = await adminFetch(endpoint);

            setVariations(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : []
            );
        } catch (err) {
            console.error(
                `Failed to load ${resourceName.toLowerCase()} variations:`,
                err
            );

            setVariationsError(
                err.message ||
                `Failed to load ${resourceName.toLowerCase()} variations.`
            );
        } finally {
            setVariationsLoading(false);
        }
    };

    useEffect(() => {
        if (!open || !product) {
            return;
        }

        setForm({
            title: product.title ?? '',
            slug: product.slug ?? '',
            var_title: product.var_title ?? '',

            category: product.category ?? '',
            subCategory: product.subCategory ?? '',
            platform: product.platform ?? '',
            workPlatform: product.workPlatform ?? '',

            item: product.item ?? 'DIGITAL KEY',
            item_type: product.item_type ?? 'GAME',

            price: product.price ?? '',
            discountPrice: product.discountPrice ?? '',
            currency: product.currency ?? 'INR',

            region: product.region ?? '',
            card_region: product.card_region ?? '',

            notice: product.notice ?? '',
            description: product.description ?? '',
            descriptionkey: product.descriptionkey ?? '',

            publisher: product.publisher ?? '',
            developer: product.developer ?? '',
            releaseDate: product.releaseDate
                ? String(product.releaseDate).slice(0, 10)
                : '',
            editiondescription:
                product.editiondescription ?? '',
            age: product.age ?? '',

            minimumRequirement:
                normalizeRequirement(
                    product.minimumRequirement
                ),

            recommendedRequirement:
                normalizeRequirement(
                    product.recommendedRequirement
                ),

            audio_language:
                normalizeArray(product.audio_language),

            interface_language:
                normalizeArray(product.interface_language),

            subtitles_language:
                normalizeArray(product.subtitles_language),

            image: normalizeImage(product.image),

            gallery: normalizeArray(product.gallery),

            platform_image: normalizeImage(
                product.platform_image
            ),

            platform_icon_image: normalizeImage(
                product.platform_icon_image
            ),

            status: product.status ?? 'draft',

            available: Boolean(product.available),
            isBestSeller: Boolean(product.isBestSeller),
            isRecommended: Boolean(product.isRecommended),
            psn: Boolean(product.psn),

            rating: product.rating ?? '0',

            relatedProducts:
                normalizeArray(product.relatedProducts),

            seo: product.seo
                ? JSON.stringify(product.seo, null, 2)
                : '',

            Tags: normalizeArray(product.Tags),
        });

        setError('');
        setUploadError('');
    }, [open, product]);

    useEffect(() => {
        const groupId = isGiftCard
            ? product?.giftCardGroupId
            : product?.productGroupId;

        if (!open || !groupId) {
            setVariations([]);
            setVariationsError('');
            return;
        }

        loadVariations();
    }, [open, product, isGiftCard]);

    if (!open || !product) {
        return null;
    }

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }));
    };

    const handleVariationChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setVariationForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetVariationForm = () => {
        setVariationForm({
            title: '',
            slug: '',
            var_title: '',
            region: '',
            price: '',
            discountPrice: '',
        });

        setShowAddVariation(false);
    };

    const handleAddVariation = async () => {

        const groupId = isGiftCard
            ? product?.giftCardGroupId
            : product?.productGroupId;

        if (!groupId) {
            setVariationsError(
                `This ${resourceName.toLowerCase()} is not part of a variation group.`
            );
            return;
        }

        setVariationsError('');
        setAddingVariation(true);

        try {
            const payload = {
                title: variationForm.title.trim(),
                slug: variationForm.slug.trim(),
                var_title: variationForm.var_title.trim(),
                region: variationForm.region.trim(),
                price: variationForm.price,
                discountPrice: variationForm.discountPrice,
            };

            if (!payload.title) {
                throw new Error('Variation title is required.');
            }

            if (!payload.var_title) {
                throw new Error(
                    'Variation / Edition title is required.'
                );
            }

            if (!payload.region) {
                throw new Error('Region is required.');
            }

            if (
                payload.price === '' ||
                Number(payload.price) < 0
            ) {
                throw new Error(
                    'A valid price is required.'
                );
            }

            if (
                payload.discountPrice === '' ||
                Number(payload.discountPrice) < 0
            ) {
                throw new Error(
                    'A valid discount price is required.'
                );
            }

            const endpoint = isGiftCard
                ? `/admin/gift-cards/${product._id}/variations`
                : `/admin/products/${product._id}/variations`;

            await adminFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            await loadVariations();
            resetVariationForm();
        } catch (err) {
            console.error(
                `Failed to add ${resourceName.toLowerCase()} variation:`,
                err
            );

            setVariationsError(
                err.message ||
                `Failed to add ${resourceName.toLowerCase()} variation.`
            );
        } finally {
            setAddingVariation(false);
        }
    };

    const handleRequirementChange = (
        requirementType,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            [requirementType]: {
                ...prev[requirementType],
                [field]: value,
            },
        }));
    };

    const uploadImage = async (
        file,
        { folder = 'keyzoo/products' } = {}
    ) => {
        if (!file) {
            return null;
        }

        if (!file.type.startsWith('image/')) {
            throw new Error(
                'Only image files are allowed.'
            );
        }

        if (file.size > 10 * 1024 * 1024) {
            throw new Error(
                'Image must be smaller than 10 MB.'
            );
        }

        const token =
            sessionStorage.getItem('admin_jwt');

        if (!token) {
            throw new Error(
                'Admin session expired. Please log in again.'
            );
        }

        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL;

        const formData = new FormData();

        formData.append('image', file);
        formData.append('folder', folder);

        const response = await fetch(
            `${apiUrl}/admin/media/upload`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            sessionStorage.removeItem(
                'admin_jwt'
            );

            window.location.href =
                '/admin/login';

            throw new Error(
                'Admin session expired.'
            );
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                'Image upload failed.'
            );
        }

        if (!data.success || !data.data?.url) {
            throw new Error(
                'Image upload succeeded but no image URL was returned.'
            );
        }

        return data.data.url;
    };

    // If you want to url support then add it...
    const handleImageUrlChange = (field) => (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSingleImageUpload = async (
        event,
        field,
        folder
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadError('');

        setUploading((prev) => ({
            ...prev,
            [field]: true,
        }));

        try {
            const url = await uploadImage(
                file,
                { folder }
            );

            setForm((prev) => ({
                ...prev,
                [field]: url,
            }));
        } catch (err) {
            console.error(
                'Image upload failed:',
                err
            );

            setUploadError(
                err.message ||
                'Image upload failed.'
            );
        } finally {
            setUploading((prev) => ({
                ...prev,
                [field]: false,
            }));

            event.target.value = '';
        }
    };

    const handleGalleryUpload = async (event) => {
        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) {
            return;
        }

        setUploadError('');

        setUploading((prev) => ({
            ...prev,
            gallery: true,
        }));

        try {
            const uploadedUrls = [];

            for (const file of files) {
                const url = await uploadImage(
                    file,
                    {
                        folder:
                            'keyzoo/products/gallery',
                    }
                );

                uploadedUrls.push(url);
            }

            setForm((prev) => ({
                ...prev,
                gallery: [
                    ...parseCommaSeparated(
                        prev.gallery
                    ),
                    ...uploadedUrls,
                ].join(', '),
            }));
        } catch (err) {
            console.error(
                'Gallery upload failed:',
                err
            );

            setUploadError(
                err.message ||
                'Gallery upload failed.'
            );
        } finally {
            setUploading((prev) => ({
                ...prev,
                gallery: false,
            }));

            event.target.value = '';
        }
    };

    const buildPayload = () => {
        return {
            title: form.title,
            slug: form.slug,
            var_title: form.var_title || null,

            category: form.category || null,
            subCategory: form.subCategory || null,
            platform: form.platform || null,
            workPlatform:
                form.workPlatform || null,

            item:
                form.item || 'DIGITAL KEY',

            item_type:
                form.item_type || 'GAME',

            price: form.price,
            discountPrice:
                form.discountPrice,

            currency:
                form.currency || 'INR',

            region: form.region || null,
            card_region:
                form.card_region || null,

            notice: form.notice || null,
            description:
                form.description || null,
            descriptionkey:
                form.descriptionkey || null,

            publisher:
                form.publisher || null,
            developer:
                form.developer || null,
            releaseDate:
                form.releaseDate || null,
            editiondescription:
                form.editiondescription ||
                null,
            age: form.age || null,

            minimumRequirement:
                form.minimumRequirement,

            recommendedRequirement:
                form.recommendedRequirement,

            audio_language:
                parseCommaSeparated(
                    form.audio_language
                ),

            interface_language:
                parseCommaSeparated(
                    form.interface_language
                ),

            subtitles_language:
                parseCommaSeparated(
                    form.subtitles_language
                ),

            image: form.image || null,

            gallery:
                parseCommaSeparated(
                    form.gallery
                ),

            platform_image:
                form.platform_image || null,

            platform_icon_image:
                form.platform_icon_image ||
                null,

            status:
                form.status || 'draft',

            available:
                form.available,

            isBestSeller:
                form.isBestSeller,

            isRecommended:
                form.isRecommended,

            psn: form.psn,

            rating:
                form.rating || 0,

            relatedProducts:
                parseCommaSeparated(
                    form.relatedProducts
                ),

            seo: parseJson(form.seo),

            Tags:
                parseCommaSeparated(
                    form.Tags
                ),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const payload = buildPayload();

            const endpoint =
                product.type === 'gift-card'
                    ? `/admin/gift-cards/${product._id}`
                    : `/admin/products/${product._id}`;

            const data = await adminFetch(
                endpoint,
                {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                }
            );

            if (onUpdated) {
                await onUpdated(data);
            }

            onClose();
        } catch (err) {
            console.error(
                'Failed to update product:',
                err
            );

            setError(
                err.message ||
                'Failed to update product.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                fixed inset-0 z-[100]
                flex items-center justify-center
                bg-black/80
                p-4
            "
            onMouseDown={(e) => {
                if (
                    e.target ===
                    e.currentTarget &&
                    !loading
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-6xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border border-white/10
                    bg-[#1b1b1b]
                    text-white
                    shadow-2xl
                "
            >
                {/* Header */}
                <div
                    className="
                        flex shrink-0
                        items-center justify-between
                        border-b border-white/10
                        bg-[#1b1b1b]
                        px-6 py-5
                    "
                >
                    <div>
                        <h2 className="text-xl font-semibold">
                            Edit {resourceName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Update {resourceName.toLowerCase()} and variation
                            details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            bg-white/5
                            text-xl text-gray-400
                            transition
                            hover:bg-white/10
                            hover:text-white
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>
                </div>

                <div className="overflow-y-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 p-6"
                    >
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {uploadError && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {uploadError}
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                            <Section
                                title="Product Information"
                                description="Update the core product and variation information."
                            >
                                <div className="space-y-4">
                                    <Field
                                        label="Title"
                                        name="title"
                                        value={
                                            form.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Product title"
                                        required
                                    />

                                    <Field
                                        label="Variation Title"
                                        name="var_title"
                                        value={
                                            form.var_title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Standard / Premium / 100 PLN"
                                    />

                                    <Field
                                        label="Slug"
                                        name="slug"
                                        value={
                                            form.slug
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="product-slug"
                                    />

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Field
                                            label="Category"
                                            name="category"
                                            value={
                                                form.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Games"
                                        />

                                        <Field
                                            label="Sub Category"
                                            name="subCategory"
                                            value={
                                                form.subCategory
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Action / RPG"
                                        />

                                        <Field
                                            label="Platform"
                                            name="platform"
                                            value={
                                                form.platform
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Steam"
                                        />

                                        <Field
                                            label="Work Platform"
                                            name="workPlatform"
                                            value={
                                                form.workPlatform
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="PC"
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section
                                title="Product Settings"
                                description="Store behavior and product state."
                            >
                                <div className="space-y-4">
                                    <SelectField
                                        label="Status"
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        options={[
                                            {
                                                value: 'draft',
                                                label: 'Draft',
                                            },
                                            {
                                                value: 'published',
                                                label: 'Published',
                                            },
                                        ]}
                                    />

                                    <SelectField
                                        label="Item"
                                        name="item"
                                        value={
                                            form.item
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        options={[
                                            {
                                                value: 'DIGITAL KEY',
                                                label: 'DIGITAL KEY',
                                            },
                                        ]}
                                    />

                                    <SelectField
                                        label="Item Type"
                                        name="item_type"
                                        value={
                                            form.item_type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        options={[
                                            {
                                                value: 'GAME',
                                                label: 'GAME',
                                            },
                                            {
                                                value: 'SUBSCRIPTION',
                                                label: 'SUBSCRIPTION',
                                            },
                                            {
                                                value: 'GIFT CARD',
                                                label: 'GIFT CARD',
                                            },
                                        ]}
                                    />

                                    <Field
                                        label="Rating"
                                        name="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={
                                            form.rating
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="0"
                                    />

                                    <div className="space-y-2 pt-1">
                                        {[
                                            [
                                                'isBestSeller',
                                                'Best Seller',
                                            ],
                                            [
                                                'isRecommended',
                                                'Recommended',
                                            ],
                                            [
                                                'available',
                                                'available'
                                            ],
                                            [
                                                'psn',
                                                'PSN',
                                            ],
                                        ].map(
                                            ([
                                                name,
                                                label,
                                            ]) => (
                                                <label
                                                    key={
                                                        name
                                                    }
                                                    className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5"
                                                >
                                                    <span className="text-xs text-gray-300">
                                                        {
                                                            label
                                                        }
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        name={
                                                            name
                                                        }
                                                        checked={
                                                            form[
                                                            name
                                                            ]
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        className="h-4 w-4 accent-indigo-500"
                                                    />
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>
                            </Section>
                        </div>

                        {/* Pricing */}
                        <Section
                            title="Pricing & Region"
                            description="Update the selling price, discount and regional availability."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <Field
                                    label="Price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <Field
                                    label="Discount Price"
                                    name="discountPrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.discountPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <SelectField
                                    label="Currency"
                                    name="currency"
                                    value={
                                        form.currency
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    options={[
                                        {
                                            value: 'INR',
                                            label: 'INR',
                                        },
                                        {
                                            value: 'USD',
                                            label: 'USD',
                                        },
                                        {
                                            value: 'EUR',
                                            label: 'EUR',
                                        },
                                        {
                                            value: 'PLN',
                                            label: 'PLN',
                                        },
                                    ]}
                                />

                                <Field
                                    label="Region"
                                    name="region"
                                    value={
                                        form.region
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="GLOBAL"
                                />

                                <Field
                                    label="Card Region"
                                    name="card_region"
                                    value={
                                        form.card_region
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="PL"
                                />
                            </div>
                        </Section>

                        {/* Product Variations */}
                        {(isGiftCard ? product?.giftCardGroupId : product?.productGroupId) && (
                            <Section
                                title={`${resourceName} Variations`}
                                description={`Manage the sellable SKUs that belong to this ${resourceName.toLowerCase()} group.`}
                            >
                                <div className="space-y-4">

                                    {/* Header */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {variations.length} {resourceName} SKU{variations.length !== 1 ? 's' : ''}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Each variation is a separate
                                                sellable product.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVariationsError('');
                                                setShowAddVariation(
                                                    (prev) => !prev
                                                );
                                            }}
                                            disabled={
                                                addingVariation ||
                                                variationsLoading
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-xl
                                                border border-indigo-500/30
                                                bg-indigo-500/10
                                                px-4 py-2.5
                                                text-sm font-medium
                                                text-indigo-300
                                                transition
                                                hover:border-indigo-500/50
                                                hover:bg-indigo-500/20
                                                hover:text-white
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            <span className="text-lg leading-none">
                                                +
                                            </span>

                                            Add Variation
                                        </button>
                                    </div>

                                    {/* Error */}
                                    {variationsError && (
                                        <div className="
                                            rounded-xl
                                            border border-red-500/20
                                            bg-red-500/10
                                            px-4 py-3
                                            text-sm text-red-400
                                        ">
                                            {variationsError}
                                        </div>
                                    )}

                                    {/* Loading */}
                                    {variationsLoading ? (
                                        <div className="
                                            rounded-xl
                                            border border-white/10
                                            bg-white/[0.025]
                                            px-4 py-8
                                            text-center
                                            text-sm text-gray-500
                                        ">
                                            Loading variations...
                                        </div>
                                    ) : variations.length === 0 ? (
                                        <div className="
                                            rounded-xl
                                            border border-dashed
                                            border-white/10
                                            bg-white/[0.015]
                                            px-4 py-8
                                            text-center
                                        ">
                                            <p className="text-sm text-gray-400">
                                                No variations found.
                                            </p>

                                            <p className="mt-1 text-xs text-gray-600">
                                                Add another sellable SKU to
                                                this product group.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="
                                            overflow-hidden
                                            rounded-xl
                                            border border-white/10
                                        ">
                                            <div className="
                                                hidden
                                                grid-cols-[minmax(0,2fr)_120px_160px_120px_120px]
                                                gap-4
                                                border-b border-white/10
                                                bg-white/[0.025]
                                                px-4 py-3
                                                text-[11px]
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-gray-500
                                                md:grid
                                            ">
                                                <span>Product</span>
                                                <span>Region</span>
                                                <span>Edition</span>
                                                <span>Price</span>
                                                <span>Status</span>
                                            </div>

                                            <div className="divide-y divide-white/10">
                                                {variations.map(
                                                    (variation) => {
                                                        const isCurrent =
                                                            String(
                                                                variation._id
                                                            ) ===
                                                            String(
                                                                product._id
                                                            );

                                                        const isParent =
                                                            Boolean(
                                                                variation.isParent
                                                            );

                                                        const price =
                                                            Number(
                                                                variation.price
                                                            );

                                                        const discountPrice =
                                                            Number(
                                                                variation.discountPrice
                                                            );

                                                        const hasDiscount =
                                                            Number.isFinite(
                                                                price
                                                            ) &&
                                                            Number.isFinite(
                                                                discountPrice
                                                            ) &&
                                                            discountPrice <
                                                            price;

                                                        return (
                                                            <div
                                                                key={
                                                                    variation._id
                                                                }
                                                                className="
                                                                    grid
                                                                    grid-cols-1
                                                                    gap-3
                                                                    px-4 py-4
                                                                    md:grid-cols-[minmax(0,2fr)_120px_160px_120px_120px]
                                                                    md:items-center
                                                                    md:gap-4
                                                                "
                                                            >
                                                                {/* Product */}
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="
                                                                            truncate
                                                                            text-sm
                                                                            font-medium
                                                                            text-white
                                                                        ">
                                                                            {
                                                                                variation.title
                                                                            }
                                                                        </p>

                                                                        {isParent && (
                                                                            <span className="
                                                                                shrink-0
                                                                                rounded-md
                                                                                border
                                                                                border-indigo-500/20
                                                                                bg-indigo-500/10
                                                                                px-1.5
                                                                                py-0.5
                                                                                text-[10px]
                                                                                font-medium
                                                                                text-indigo-300
                                                                            ">
                                                                                Parent
                                                                            </span>
                                                                        )}

                                                                        {isCurrent && (
                                                                            <span className="
                                                                                shrink-0
                                                                                rounded-md
                                                                                border
                                                                                border-white/10
                                                                                bg-white/5
                                                                                px-1.5
                                                                                py-0.5
                                                                                text-[10px]
                                                                                font-medium
                                                                                text-gray-400
                                                                            ">
                                                                                Current
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <p className="
                                                                        mt-1
                                                                        truncate
                                                                        text-xs
                                                                        text-gray-500
                                                                    ">
                                                                        {
                                                                            variation.slug
                                                                        }
                                                                    </p>

                                                                    <div className="mt-2 md:hidden">
                                                                        <div className="flex flex-wrap gap-2">
                                                                            <span className="
                                                                                rounded-md
                                                                                bg-white/5
                                                                                px-2 py-1
                                                                                text-[11px]
                                                                                text-gray-400
                                                                            ">
                                                                                {
                                                                                    variation.region ||
                                                                                    'No region'
                                                                                }
                                                                            </span>

                                                                            <span className="
                                                                                rounded-md
                                                                                bg-white/5
                                                                                px-2 py-1
                                                                                text-[11px]
                                                                                text-gray-400
                                                                            ">
                                                                                {
                                                                                    variation.var_title ||
                                                                                    'No edition'
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Region */}
                                                                <div className="hidden md:block">
                                                                    <span className="text-xs text-gray-300">
                                                                        {
                                                                            variation.region ||
                                                                            '—'
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {/* Edition */}
                                                                <div className="hidden md:block">
                                                                    <span className="text-xs text-gray-300">
                                                                        {
                                                                            variation.var_title ||
                                                                            '—'
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {/* Price */}
                                                                <div>
                                                                    {Number.isFinite(
                                                                        price
                                                                    ) ? (
                                                                        <div>
                                                                            <p className="text-sm font-medium text-white">
                                                                                {variation.currency ||
                                                                                    'INR'}{' '}
                                                                                {hasDiscount
                                                                                    ? discountPrice.toLocaleString()
                                                                                    : price.toLocaleString()}
                                                                            </p>

                                                                            {hasDiscount && (
                                                                                <p className="
                                                                                    mt-0.5
                                                                                    text-[11px]
                                                                                    text-gray-500
                                                                                    line-through
                                                                                ">
                                                                                    {
                                                                                        variation.currency
                                                                                    }{' '}
                                                                                    {price.toLocaleString()}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-500">
                                                                            —
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Status */}
                                                                <div>
                                                                    <span
                                                                        className={`
                                                                            inline-flex
                                                                            rounded-full
                                                                            border
                                                                            px-2 py-1
                                                                            text-[10px]
                                                                            font-medium
                                                                            ${variation.status ===
                                                                                'published'
                                                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                                                : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {variation.status ===
                                                                            'published'
                                                                            ? 'Published'
                                                                            : 'Draft'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Variation Form */}
                                    {showAddVariation && (
                                        <div
                                            className="
                                                rounded-2xl
                                                border border-indigo-500/20
                                                bg-indigo-500/[0.03]
                                                p-5
                                            "
                                        >
                                            <div className="mb-5">
                                                <h4 className="text-sm font-semibold text-white">
                                                    Add Variation
                                                </h4>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Create another sellable SKU
                                                    inside this product group.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <Field
                                                    label="Title"
                                                    name="title"
                                                    value={
                                                        variationForm.title
                                                    }
                                                    onChange={
                                                        handleVariationChange
                                                    }
                                                    placeholder="Grand Theft Auto V (India Deluxe) (PC) - Rockstar - Digital Key"
                                                    required
                                                />

                                                <Field
                                                    label="Variation / Edition Title"
                                                    name="var_title"
                                                    value={
                                                        variationForm.var_title
                                                    }
                                                    onChange={
                                                        handleVariationChange
                                                    }
                                                    placeholder="Deluxe Edition"
                                                    required
                                                />

                                                <Field
                                                    label="Slug"
                                                    name="slug"
                                                    value={
                                                        variationForm.slug
                                                    }
                                                    onChange={
                                                        handleVariationChange
                                                    }
                                                    placeholder="Leave blank to generate from title"
                                                />

                                                <Field
                                                    label="Region"
                                                    name="region"
                                                    value={
                                                        variationForm.region
                                                    }
                                                    onChange={
                                                        handleVariationChange
                                                    }
                                                    placeholder="India"
                                                    required
                                                />

                                                <Field
                                                    label="Price"
                                                    name="price"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        variationForm.price
                                                    }
                                                    onChange={
                                                        handleVariationChange
                                                    }
                                                    placeholder="2499"
                                                    required
                                                />

                                                <Field
                                                    label="Discount Price"
                                                    name="discountPrice"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        variationForm.discountPrice
                                                    }
                                                    onChange={
                                                        handleVariationChange
                                                    }
                                                    placeholder="2199"
                                                    required
                                                />
                                            </div>

                                            <div className="mt-5 flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        resetVariationForm
                                                    }
                                                    disabled={
                                                        addingVariation
                                                    }
                                                    className="
                                                        rounded-xl
                                                        border border-white/10
                                                        bg-white/5
                                                        px-4 py-2.5
                                                        text-sm
                                                        font-medium
                                                        text-gray-300
                                                        transition
                                                        hover:bg-white/10
                                                        hover:text-white
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleAddVariation}
                                                    disabled={
                                                        addingVariation
                                                    }
                                                    className="
                                                        rounded-xl
                                                        bg-indigo-500
                                                        px-4 py-2.5
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                        transition
                                                        hover:bg-indigo-600
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    {addingVariation
                                                        ? 'Adding...'
                                                        : 'Add Variation'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Details */}
                        <Section
                            title="Product Details"
                            description="Content and metadata displayed on the product page."
                        >
                            <div className="space-y-4">
                                <TextareaField
                                    label="Notice"
                                    name="notice"
                                    value={
                                        form.notice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Important notice..."
                                />

                                <TextareaField
                                    label="Description"
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Product description..."
                                />

                                <TextareaField
                                    label="Description Key"
                                    name="descriptionkey"
                                    value={
                                        form.descriptionkey
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Information about how the digital key works..."
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <Field
                                        label="Publisher"
                                        name="publisher"
                                        value={
                                            form.publisher
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <Field
                                        label="Developer"
                                        name="developer"
                                        value={
                                            form.developer
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <Field
                                        label="Release Date"
                                        name="releaseDate"
                                        type="date"
                                        value={
                                            form.releaseDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                                    <TextareaField
                                        label="Edition Description"
                                        name="editiondescription"
                                        value={
                                            form.editiondescription
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe this edition..."
                                    />

                                    <Field
                                        label="Age"
                                        name="age"
                                        value={
                                            form.age
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="18+"
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Languages */}
                        <Section
                            title="Languages"
                            description="Enter multiple values separated by commas."
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field
                                    label="Audio Language"
                                    name="audio_language"
                                    value={
                                        form.audio_language
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="English, French, German"
                                />

                                <Field
                                    label="Interface Language"
                                    name="interface_language"
                                    value={
                                        form.interface_language
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="English, French, German"
                                />

                                <Field
                                    label="Subtitles Language"
                                    name="subtitles_language"
                                    value={
                                        form.subtitles_language
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="English, Spanish"
                                />
                            </div>
                        </Section>

                        {/* Requirements */}
                        <Section
                            title="System Requirements"
                            description="Update minimum and recommended requirements."
                        >
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <div>
                                    <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                                        <h4 className="text-sm font-medium">
                                            Minimum Requirements
                                        </h4>
                                    </div>

                                    <RequirementFields
                                        value={
                                            form.minimumRequirement
                                        }
                                        prefix="minimumRequirement"
                                        onChange={
                                            handleRequirementChange
                                        }
                                    />
                                </div>

                                <div>
                                    <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                                        <h4 className="text-sm font-medium">
                                            Recommended Requirements
                                        </h4>
                                    </div>

                                    <RequirementFields
                                        value={
                                            form.recommendedRequirement
                                        }
                                        prefix="recommendedRequirement"
                                        onChange={
                                            handleRequirementChange
                                        }
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Media */}
                        <Section title="Media" description="Upload replacement images. Existing images are preserved until replaced.">

                            <div className="space-y-6">

                                {/* Main image */}
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-400">
                                        Product Image
                                    </label>

                                    {form.image && (
                                        <ImagePreview
                                            src={
                                                form.image
                                            }
                                            alt="Product image"
                                            className="mt-3 h-56 w-full max-w-md mb-3"
                                        />
                                    )}

                                    <input
                                        ref={
                                            mainImageInputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleSingleImageUpload(
                                                e,
                                                'image',
                                                'keyzoo/products'
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            mainImageInputRef.current?.click()
                                        }
                                        disabled={
                                            uploading.image
                                        }
                                        className="flex w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] px-4 py-6 text-sm text-gray-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white disabled:opacity-50"
                                    >
                                        {uploading.image
                                            ? 'Uploading image...'
                                            : 'Click to replace main image'}
                                    </button>

                                    <div className="my-4 flex items-center gap-3">
                                        <div className="h-px flex-1 bg-white/10" />

                                        <span className="text-xs text-gray-500">
                                            OR
                                        </span>

                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>

                                    <input
                                        type="url"
                                        value={form.image}
                                        onChange={handleImageUrlChange('image')}
                                        placeholder="https://example.com/banner.jpg"
                                        className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                                    />

                                    <p className="mt-2 text-xs text-gray-600">
                                        Upload an image from your PC or paste an existing image URL.
                                    </p>

                                </div>

                                {/* Platform images */}
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-gray-400">
                                            Platform Image
                                        </label>

                                        {form.platform_image && (
                                            <ImagePreview
                                                src={
                                                    form.platform_image
                                                }
                                                alt="Platform"
                                                className="mt-3 h-32 w-full mb-3"
                                            />
                                        )}

                                        <input
                                            ref={
                                                platformImageInputRef
                                            }
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleSingleImageUpload(
                                                    e,
                                                    'platform_image',
                                                    'keyzoo/platforms'
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                platformImageInputRef.current?.click()
                                            }
                                            disabled={
                                                uploading.platform_image
                                            }
                                            className="flex w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] px-4 py-5 text-xs text-gray-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white disabled:opacity-50"
                                        >
                                            {uploading.platform_image
                                                ? 'Uploading...'
                                                : 'Replace Platform Image'}
                                        </button>

                                        <div className="my-4 flex items-center gap-3">
                                            <div className="h-px flex-1 bg-white/10" />

                                            <span className="text-xs text-gray-500">
                                                OR
                                            </span>

                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>

                                        <input
                                            type="url"
                                            value={form.platform_image}
                                            onChange={handleImageUrlChange('platform_image')}
                                            placeholder="https://example.com/banner.jpg"
                                            className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                                        />

                                        <p className="mt-2 text-xs text-gray-600">
                                            Upload an image from your PC or paste an existing image URL.
                                        </p>

                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-gray-400">
                                            Platform Icon
                                        </label>

                                        {form.platform_icon_image && (
                                            <ImagePreview
                                                src={
                                                    form.platform_icon_image
                                                }
                                                alt="Platform icon"
                                                className="mt-3 h-32 w-32 mb-3"
                                            />
                                        )}

                                        <input
                                            ref={
                                                platformIconInputRef
                                            }
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleSingleImageUpload(
                                                    e,
                                                    'platform_icon_image',
                                                    'keyzoo/platform-icons'
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                platformIconInputRef.current?.click()
                                            }
                                            disabled={
                                                uploading.platform_icon_image
                                            }
                                            className="flex w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] px-4 py-5 text-xs text-gray-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white disabled:opacity-50"
                                        >
                                            {uploading.platform_icon_image
                                                ? 'Uploading...'
                                                : 'Replace Platform Icon'}
                                        </button>

                                        <div className="my-4 flex items-center gap-3">
                                            <div className="h-px flex-1 bg-white/10" />

                                            <span className="text-xs text-gray-500">
                                                OR
                                            </span>

                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>

                                        {/* Image URL */}
                                        <input
                                            type="url"
                                            value={form.platform_icon_image}
                                            onChange={handleImageUrlChange('platform_icon_image')}
                                            placeholder="https://example.com/banner.jpg"
                                            className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                                        />

                                        <p className="mt-2 text-xs text-gray-600">
                                            Upload an image from your PC or paste an existing image URL.
                                        </p>

                                    </div>

                                </div>

                                {/* Gallery */}
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-gray-400">
                                        Gallery Images
                                    </label>

                                    {form.gallery && (
                                        <div className="mt-4 mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                            {parseCommaSeparated(
                                                form.gallery
                                            ).map(
                                                (
                                                    url,
                                                    index
                                                ) => (
                                                    <ImagePreview
                                                        key={`${url}-${index}`}
                                                        src={
                                                            url
                                                        }
                                                        alt={`Gallery ${index + 1}`}
                                                        className="h-28 w-full"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}

                                    <input
                                        ref={
                                            galleryInputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={
                                            handleGalleryUpload
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            galleryInputRef.current?.click()
                                        }
                                        disabled={
                                            uploading.gallery
                                        }
                                        className="flex w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] px-4 py-6 text-sm text-gray-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white disabled:opacity-50"
                                    >
                                        {uploading.gallery
                                            ? 'Uploading gallery images...'
                                            : 'Add Gallery Images'}
                                    </button>

                                    <div className="my-4 flex items-center gap-3">
                                        <div className="h-px flex-1 bg-white/10" />

                                        <span className="text-xs text-gray-500">
                                            OR
                                        </span>

                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>

                                    {/* Image URL */}
                                    <input
                                        type="url"
                                        value={form.gallery}
                                        onChange={handleImageUrlChange('gallery')}
                                        placeholder="https://example.com/banner.jpg"
                                        className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                                    />

                                    <p className="mt-2 text-xs text-gray-600">
                                        Upload an image from your PC or paste an existing image URL.
                                    </p>

                                </div>

                            </div>

                        </Section>

                        {/* SEO */}
                        <Section
                            title="SEO & Tags"
                            description="Optional search engine metadata and product tags."
                        >
                            <div className="space-y-4">
                                <TextareaField
                                    label="SEO JSON"
                                    name="seo"
                                    value={
                                        form.seo
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={`{
  "metaTitle": "",
  "metaDescription": "",
  "keywords": []
}`}
                                />

                                <Field
                                    label="Tags"
                                    name="Tags"
                                    value={
                                        form.Tags
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="action, rpg, steam, pc"
                                />
                            </div>
                        </Section>

                        {/* Related products */}
                        <Section
                            title="Related Products"
                            description="Enter MongoDB product IDs separated by commas."
                        >
                            <Field
                                label="Product IDs"
                                name="relatedProducts"
                                value={
                                    form.relatedProducts
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="68c..., 68d..., 68e..."
                            />
                        </Section>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}