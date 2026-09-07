import Link from "next/link";

const Breadcrumb = ({ categories = [], productTitle }) => {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ol className="list-reset flex flex-wrap items-center">
        <li>
          <Link href="/" className="hover:underline text-black">Home</Link>
        </li>

        {categories.map((category, index) => (
          <React.Fragment key={category.id}>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link
                href={`/category/${category.attributes.slug}`}
                className="hover:underline text-black"
              >
                {category.attributes.name}
              </Link>
            </li>
          </React.Fragment>
        ))}

        <li><span className="mx-2">/</span></li>
        <li className="text-gray-400">{productTitle}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
