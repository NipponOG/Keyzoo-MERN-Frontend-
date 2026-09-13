'use client';

import { useRef, useState } from 'react';
import adminFetch from '@/lib/adminFetch';

const initialForm = {
    title: '',
    slug: '',

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

    minimumRequirement: {
        os: '',
        processor: '',
        memory: '',
        graphics: '',
        storage: '',
        sound: '',
        additional_notes: '',
    },

    recommendedRequirement: {
        os: '',
        processor: '',
        memory: '',
        graphics: '',
        storage: '',
        sound: '',
        additional_notes: '',
    },

    audio_language: '',
    interface_language: '',
    subtitles_language: '',

    image: '',
    gallery: '',
    platform_image: '',
    platform_icon_image: '',

    status: 'draft',

    isBestSeller: false,
    hideRecomend: false,
    psn: false,

    rating: '0',

    relatedProducts: '',

    seo: '',
    Tags: '',
};

const createEmptyVariation = () => ({
    var_title: '',
    price: '',
    discountPrice: '',
});

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
                value={value}
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
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">
                {label}
                {required && (
                    <span className="ml-1 text-red-400">*</span>
                )}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
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
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">
                {label}
                {required && (
                    <span className="ml-1 text-red-400">*</span>
                )}
            </label>

            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={textareaClass}
            />
        </div>
    );
}

function Section({
    title,
    description,
    children,
    className = '',
}) {
    return (
        <section
            className={`
                rounded-2xl
                border border-white/10
                bg-white/[0.025]
                p-5
                ${className}
            `}
        >
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
            {fields.map(
                ([field, label, placeholder]) => (
                    <div key={field}>
                        <label className="mb-1.5 block text-[11px] font-medium text-gray-500">
                            {label}
                        </label>

                        <input
                            type="text"
                            value={value[field]}
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
                )
            )}
        </div>
    );
}

function ImagePreview({
    src,
    alt,
    className = '',
}) {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    if (!src || error) {
        return (
            <div
                className={`
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border border-red-500/20
                    bg-red-500/5
                    ${className}
                `}
            >
                <div className="text-center">
                    <div className="mb-1 text-xl">
                        🖼️
                    </div>

                    <p className="text-[11px] text-red-400">
                        Image unavailable
                    </p>
                </div>
            </div>
        );
    }

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
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
                </div>
            )}

            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={`
                    h-full
                    w-full
                    object-contain
                    p-2
                    transition-opacity
                    duration-200
                    ${loaded
                        ? 'opacity-100'
                        : 'opacity-0'
                    }
                `}
            />
        </div>
    );
}

export default function AddProductModal({
    open,
    onClose,
    onCreated,
}) {
    const [form, setForm] =
        useState(initialForm);

    const [creationType, setCreationType] =
        useState('product');

    const [hasVariations, setHasVariations] =
        useState(false);

    const [variations, setVariations] =
        useState([
            createEmptyVariation(),
        ]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const [uploading, setUploading] =
        useState({});

    const [uploadError, setUploadError] =
        useState('');

    const mainImageInputRef =
        useRef(null);

    const platformImageInputRef =
        useRef(null);

    const platformIconInputRef =
        useRef(null);

    const galleryInputRef =
        useRef(null);

    if (!open) {
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

    const handleVariationChange = (
        index,
        field,
        value
    ) => {
        setVariations((prev) =>
            prev.map((variation, i) =>
                i === index
                    ? {
                        ...variation,
                        [field]: value,
                    }
                    : variation
            )
        );
    };

    const addVariation = () => {
        setVariations((prev) => [
            ...prev,
            createEmptyVariation(),
        ]);
    };

    const removeVariation = (index) => {
        setVariations((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    const resetForm = () => {
        setForm(initialForm);

        setCreationType('product');

        setHasVariations(false);

        setVariations([
            createEmptyVariation(),
        ]);

        setError('');
    };

    const handleClose = () => {
        if (loading) return;

        resetForm();
        onClose();
    };

    const parseCommaSeparated = (
        value
    ) => {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    };

    const parseJson = (value) => {
        if (!value.trim()) {
            return null;
        }

        try {
            return JSON.parse(value);
        } catch {
            throw new Error(
                'SEO must contain valid JSON.'
            );
        }
    };

    const buildPayload = () => {
        return {
            title: form.title,
            slug: form.slug,

            category:
                form.category || null,

            subCategory:
                form.subCategory || null,

            platform:
                form.platform || null,

            workPlatform:
                form.workPlatform || null,

            item:
                form.item ||
                'DIGITAL KEY',

            item_type:
                creationType === 'gift-card'
                    ? 'GIFT CARD'
                    : form.item_type ||
                    'GAME',

            price: form.price,
            discountPrice:
                form.discountPrice,

            currency:
                form.currency || 'INR',

            region:
                form.region || null,

            card_region:
                form.card_region || null,

            notice:
                form.notice || null,

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

            age:
                form.age || null,

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

            image:
                form.image || null,

            gallery:
                parseCommaSeparated(
                    form.gallery
                ),

            platform_image:
                form.platform_image ||
                null,

            platform_icon_image:
                form.platform_icon_image ||
                null,

            status:
                form.status || 'draft',

            isBestSeller:
                form.isBestSeller,

            hideRecomend:
                form.hideRecomend,

            psn:
                form.psn,

            rating:
                form.rating || 0,

            relatedProducts:
                parseCommaSeparated(
                    form.relatedProducts
                ),

            seo:
                parseJson(form.seo),

            Tags:
                parseCommaSeparated(
                    form.Tags
                ),
        };
    };

    const uploadImage = async (
        file,
        {
            folder = 'keyzoo/products',
        } = {}
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

        const formData =
            new FormData();

        formData.append(
            'image',
            file
        );

        formData.append(
            'folder',
            folder
        );

        const response =
            await fetch(
                `${apiUrl}/admin/media/upload`,
                {
                    method: 'POST',

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: formData,
                }
            );

        const data =
            await response.json();

        if (
            response.status === 401
        ) {
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

        if (
            !data.success ||
            !data.data?.url
        ) {
            throw new Error(
                'Image upload succeeded but no image URL was returned.'
            );
        }

        return data.data.url;
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
            const url =
                await uploadImage(
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

    const handleGalleryUpload = async (
        event
    ) => {
        const files =
            Array.from(
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
                const url =
                    await uploadImage(
                        file,
                        {
                            folder:
                                creationType ===
                                    'gift-card'
                                    ? 'keyzoo/gift-cards/gallery'
                                    : 'keyzoo/products/gallery',
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const payload =
                buildPayload();

            let data;

            if (
                creationType ===
                'gift-card'
            ) {
                if (hasVariations) {
                    data = await adminFetch(
                        '/admin/gift-cards/with-variations',
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                ...payload,
                                variations,
                            }),
                        }
                    );
                } else {
                    data = await adminFetch(
                        '/admin/gift-cards',
                        {
                            method: 'POST',
                            body: JSON.stringify(
                                payload
                            ),
                        }
                    );
                }
            } else {
                if (hasVariations) {
                    data = await adminFetch(
                        '/admin/products/with-variations',
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                ...payload,
                                variations,
                            }),
                        }
                    );
                } else {
                    data = await adminFetch(
                        '/admin/products',
                        {
                            method: 'POST',
                            body: JSON.stringify(
                                payload
                            ),
                        }
                    );
                }
            }

            if (onCreated) {
                await onCreated(data);
            }

            resetForm();
            onClose();
        } catch (err) {
            console.error(
                'Failed to create:',
                err
            );

            setError(
                err.message ||
                'Failed to create product'
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
                    e.currentTarget
                ) {
                    handleClose();
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
                            Add{' '}
                            {creationType ===
                                'gift-card'
                                ? 'Gift Card'
                                : 'Product'}
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Create a new{' '}
                            {creationType ===
                                'gift-card'
                                ? 'gift card'
                                : 'product'}{' '}
                            for your store.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
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
                            <div
                                className="
                                    rounded-xl
                                    border border-red-500/20
                                    bg-red-500/10
                                    px-4 py-3
                                    text-sm text-red-400
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Creation type */}
                        <div
                            className="
                                grid grid-cols-2
                                gap-2
                                rounded-2xl
                                border border-white/10
                                bg-white/[0.025]
                                p-1.5
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setCreationType(
                                        'product'
                                    )
                                }
                                className={`
                                    rounded-xl
                                    px-4 py-3
                                    text-sm font-medium
                                    transition
                                    ${creationType ===
                                        'product'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                Product
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setCreationType(
                                        'gift-card'
                                    )
                                }
                                className={`
                                    rounded-xl
                                    px-4 py-3
                                    text-sm font-medium
                                    transition
                                    ${creationType ===
                                        'gift-card'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                Gift Card
                            </button>
                        </div>

                        {/* Product information + settings */}
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                            <Section
                                title={
                                    creationType ===
                                        'gift-card'
                                        ? 'Gift Card Information'
                                        : 'Product Information'
                                }
                                description={
                                    creationType ===
                                        'gift-card'
                                        ? 'Core information for the gift card.'
                                        : 'Core information used to identify and classify the product.'
                                }
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
                                        placeholder={
                                            creationType ===
                                                'gift-card'
                                                ? 'PlayStation Store Gift Card'
                                                : 'Clair Obscur: Expedition 33'
                                        }
                                        required
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
                                        placeholder="Leave empty to generate automatically"
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
                                            placeholder={
                                                creationType ===
                                                    'gift-card'
                                                    ? 'gift-card'
                                                    : 'Games'
                                            }
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
                                            placeholder={
                                                creationType ===
                                                    'gift-card'
                                                    ? 'PlayStation'
                                                    : 'Steam'
                                            }
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

                                    {creationType ===
                                        'product' && (
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
                                                ]}
                                            />
                                        )}

                                    {creationType ===
                                        'gift-card' && (
                                            <div>
                                                <label className="mb-2 block text-xs font-medium text-gray-400">
                                                    Item Type
                                                </label>

                                                <div className="flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.025] px-3.5 text-sm text-gray-300">
                                                    GIFT CARD
                                                </div>
                                            </div>
                                        )}

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
                                                'hideRecomend',
                                                'Hide Recommendation',
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
                                                    className="
                                                        flex cursor-pointer
                                                        items-center justify-between
                                                        rounded-xl
                                                        border border-white/10
                                                        bg-white/[0.025]
                                                        px-3 py-2.5
                                                    "
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
                            description={
                                creationType ===
                                    'gift-card'
                                    ? 'Set the selling price and regional availability for the gift card.'
                                    : 'Set the selling price, discount and regional availability.'
                            }
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {!hasVariations && (
                                    <>
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
                                            placeholder="1999"
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
                                            placeholder="1499"
                                            required
                                        />
                                    </>
                                )}

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

                        {/* Product details */}
                        <Section
                            title={
                                creationType ===
                                    'gift-card'
                                    ? 'Gift Card Details'
                                    : 'Product Details'
                            }
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
                                    placeholder="Important notice shown to customers..."
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
                                    placeholder="Write the main description..."
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
                                        placeholder="Publisher"
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
                                        placeholder="Developer"
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

                        {/* Languages + product type */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <Section
                                title="Languages"
                                description="Enter multiple values separated by commas."
                            >
                                <div className="space-y-4">
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

                            <Section
                                title="Product Type"
                                description="Choose whether this item has multiple variations."
                            >
                                <div className="space-y-4">
                                    <div
                                        className="
                                            flex items-center
                                            justify-between
                                            rounded-xl
                                            border border-white/10
                                            bg-white/[0.025]
                                            px-4 py-3
                                        "
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                Has variations
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {creationType ===
                                                    'gift-card'
                                                    ? 'Use this for denominations such as 100 PLN, 150 PLN and 200 PLN.'
                                                    : 'Use this for editions such as Standard and Premium.'}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setHasVariations(
                                                    (prev) =>
                                                        !prev
                                                )
                                            }
                                            className={`
                                                relative h-7 w-12
                                                shrink-0 rounded-full
                                                transition
                                                ${hasVariations
                                                    ? 'bg-indigo-500'
                                                    : 'bg-white/10'
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    absolute top-1
                                                    h-5 w-5
                                                    rounded-full
                                                    bg-white
                                                    transition
                                                    ${hasVariations
                                                        ? 'left-6'
                                                        : 'left-1'
                                                    }
                                                `}
                                            />
                                        </button>
                                    </div>

                                    {creationType ===
                                        'gift-card' && (
                                            <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 px-4 py-3">
                                                <p className="text-xs leading-5 text-gray-400">
                                                    Example:{' '}
                                                    <span className="text-gray-300">
                                                        PlayStation
                                                        Store
                                                        Gift
                                                        Card -
                                                        Poland
                                                    </span>
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Variations:{' '}
                                                    100 PLN,
                                                    150 PLN,
                                                    200 PLN
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </Section>
                        </div>

                        {/* Requirements */}
                        <Section
                            title="System Requirements"
                            description="Define minimum and recommended requirements for the product."
                        >
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <div>
                                    <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                                        <h4 className="text-sm font-medium">
                                            Minimum
                                            Requirements
                                        </h4>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Lowest supported
                                            configuration.
                                        </p>
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
                                            Recommended
                                            Requirements
                                        </h4>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Recommended
                                            configuration.
                                        </p>
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
                        {/* Media */}
                        <Section
                            title="Media"
                            description="Upload product images and gallery images. Images are securely stored on Cloudinary."
                        >
                            <div className="space-y-6">

                                {/* Upload error */}
                                {uploadError && (
                                    <div className="
                rounded-xl
                border border-red-500/20
                bg-red-500/10
                px-4 py-3
                text-sm text-red-400
            ">
                                        {uploadError}
                                    </div>
                                )}

                                {/* Main Image */}
                                <div>
                                    <div className="mb-2">
                                        <label className="block text-xs font-medium text-gray-400">
                                            Product Image
                                        </label>

                                        <p className="mt-1 text-[11px] text-gray-500">
                                            Main image shown on product cards and product pages.
                                        </p>
                                    </div>

                                    <input
                                        ref={mainImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleSingleImageUpload(
                                                e,
                                                'image',
                                                creationType === 'gift-card'
                                                    ? 'keyzoo/gift-cards'
                                                    : 'keyzoo/products'
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            mainImageInputRef.current?.click()
                                        }
                                        disabled={uploading.image}
                                        className="
                    flex w-full
                    items-center justify-center
                    rounded-xl
                    border border-dashed border-white/15
                    bg-white/[0.025]
                    px-4 py-6
                    text-sm text-gray-400
                    transition
                    hover:border-indigo-500/50
                    hover:bg-indigo-500/5
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                    >
                                        {uploading.image ? (
                                            <span className="flex items-center gap-2">
                                                <span className="
                            h-4 w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/10
                            border-t-indigo-500
                        " />
                                                Uploading image...
                                            </span>
                                        ) : (
                                            <span>
                                                Click to upload main image
                                            </span>
                                        )}
                                    </button>

                                    {form.image && (
                                        <div className="mt-3">
                                            <p className="mb-2 text-[11px] font-medium text-gray-500">
                                                Uploaded Image
                                            </p>

                                            <ImagePreview
                                                src={form.image}
                                                alt="Product image preview"
                                                className="
                            h-48
                            w-full
                            max-w-md
                        "
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Platform images */}
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* Platform Image */}
                                    <div>
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-400">
                                                Platform Image
                                            </label>

                                            <p className="mt-1 text-[11px] text-gray-500">
                                                Image representing the platform.
                                            </p>
                                        </div>

                                        <input
                                            ref={platformImageInputRef}
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
                                            disabled={uploading.platform_image}
                                            className="
                        flex w-full
                        items-center justify-center
                        rounded-xl
                        border border-dashed border-white/15
                        bg-white/[0.025]
                        px-4 py-5
                        text-xs text-gray-400
                        transition
                        hover:border-indigo-500/50
                        hover:bg-indigo-500/5
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                                        >
                                            {uploading.platform_image ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="
                                h-4 w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-white/10
                                border-t-indigo-500
                            " />
                                                    Uploading...
                                                </span>
                                            ) : (
                                                'Upload Platform Image'
                                            )}
                                        </button>

                                        {form.platform_image && (
                                            <div className="mt-3">
                                                <ImagePreview
                                                    src={form.platform_image}
                                                    alt="Platform image preview"
                                                    className="h-32 w-full"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Platform Icon */}
                                    <div>
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-400">
                                                Platform Icon
                                            </label>

                                            <p className="mt-1 text-[11px] text-gray-500">
                                                Small icon representing the platform.
                                            </p>
                                        </div>

                                        <input
                                            ref={platformIconInputRef}
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
                                            disabled={uploading.platform_icon_image}
                                            className="
                        flex w-full
                        items-center justify-center
                        rounded-xl
                        border border-dashed border-white/15
                        bg-white/[0.025]
                        px-4 py-5
                        text-xs text-gray-400
                        transition
                        hover:border-indigo-500/50
                        hover:bg-indigo-500/5
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                                        >
                                            {uploading.platform_icon_image ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="
                                h-4 w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-white/10
                                border-t-indigo-500
                            " />
                                                    Uploading...
                                                </span>
                                            ) : (
                                                'Upload Platform Icon'
                                            )}
                                        </button>

                                        {form.platform_icon_image && (
                                            <div className="mt-3">
                                                <ImagePreview
                                                    src={form.platform_icon_image}
                                                    alt="Platform icon preview"
                                                    className="h-32 w-32"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery */}
                                <div>
                                    <div className="mb-2">
                                        <label className="block text-xs font-medium text-gray-400">
                                            Gallery Images
                                        </label>

                                        <p className="mt-1 text-[11px] text-gray-500">
                                            Select multiple images. Each image will be uploaded to Cloudinary.
                                        </p>
                                    </div>

                                    <input
                                        ref={galleryInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryUpload}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            galleryInputRef.current?.click()
                                        }
                                        disabled={uploading.gallery}
                                        className="
                    flex w-full
                    items-center justify-center
                    rounded-xl
                    border border-dashed border-white/15
                    bg-white/[0.025]
                    px-4 py-6
                    text-sm text-gray-400
                    transition
                    hover:border-indigo-500/50
                    hover:bg-indigo-500/5
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                    >
                                        {uploading.gallery ? (
                                            <span className="flex items-center gap-2">
                                                <span className="
                            h-4 w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/10
                            border-t-indigo-500
                        " />
                                                Uploading gallery images...
                                            </span>
                                        ) : (
                                            'Click to upload gallery images'
                                        )}
                                    </button>

                                    {form.gallery?.trim() && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-[11px] font-medium text-gray-500">
                                                Gallery Preview
                                            </p>

                                            <div className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-3
                        lg:grid-cols-5
                    ">
                                                {parseCommaSeparated(
                                                    form.gallery
                                                ).map((url, index) => (
                                                    <ImagePreview
                                                        key={`${url}-${index}`}
                                                        src={url}
                                                        alt={`Gallery image ${index + 1}`}
                                                        className="h-28 w-full"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
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

                        {/* Variations */}
                        {hasVariations && (
                            <Section
                                title={
                                    creationType ===
                                        'gift-card'
                                        ? 'Gift Card Variations'
                                        : 'Product Variations'
                                }
                                description={
                                    creationType ===
                                        'gift-card'
                                        ? 'Each denomination becomes its own gift card document.'
                                        : 'Each variation becomes its own product document.'
                                }
                            >
                                <div className="space-y-4">
                                    {variations.map(
                                        (
                                            variation,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="
                                                    rounded-xl
                                                    border border-white/10
                                                    bg-white/[0.025]
                                                    p-4
                                                "
                                            >
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="text-xs font-medium text-gray-400">
                                                        {creationType ===
                                                            'gift-card'
                                                            ? 'Denomination'
                                                            : 'Variation'}{' '}
                                                        {index +
                                                            1}
                                                    </span>

                                                    {variations.length >
                                                        1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeVariation(
                                                                        index
                                                                    )
                                                                }
                                                                className="text-xs text-red-400 transition hover:text-red-300"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <Field
                                                        label={
                                                            creationType ===
                                                                'gift-card'
                                                                ? 'Denomination'
                                                                : 'Variation Title'
                                                        }
                                                        value={
                                                            variation.var_title
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVariationChange(
                                                                index,
                                                                'var_title',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder={
                                                            creationType ===
                                                                'gift-card'
                                                                ? '100 PLN'
                                                                : 'Standard'
                                                        }
                                                        required
                                                    />

                                                    <Field
                                                        label="Price"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            variation.price
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVariationChange(
                                                                index,
                                                                'price',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="1999"
                                                        required
                                                    />

                                                    <Field
                                                        label="Discount Price"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            variation.discountPrice
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVariationChange(
                                                                index,
                                                                'discountPrice',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="1499"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={
                                            addVariation
                                        }
                                        className="
                                            rounded-xl
                                            border border-white/10
                                            bg-white/5
                                            px-4 py-2.5
                                            text-xs
                                            font-medium
                                            text-gray-300
                                            transition
                                            hover:bg-white/10
                                            hover:text-white
                                        "
                                    >
                                        + Add Variation
                                    </button>
                                </div>
                            </Section>
                        )}

                        {/* Footer */}
                        <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-3
                                border-t border-white/10
                                pt-5
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-5 py-3
                                    text-sm
                                    font-medium
                                    transition
                                    hover:bg-white/10
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="
                                    rounded-xl
                                    bg-indigo-500
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-indigo-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {loading
                                    ? 'Creating...'
                                    : `Create ${creationType ===
                                        'gift-card'
                                        ? 'Gift Card'
                                        : 'Product'
                                    }`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}