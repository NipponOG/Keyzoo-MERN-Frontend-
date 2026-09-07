import BlockRenderer from "@/components/Blog/BlockRenderer";

export async function getServerSideProps({ params }) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/blogs?filters[slug][$eq]=${params.slug}&populate=*`
    );

    const data = await res.json();

    return {
        props: {
            post: data.data[0],
        },
    };
}

export default function BlogPost({ post }) {

    const steps = [];
    const alternativeSteps = [];

    // Assuming a maximum of 15 steps, adjust as needed
    for (let i = 1; i <= 15; i++) {
        if (post[`content_description_${i}`]) {
            steps.push({
                title: post[`content_title_${i}`],
                desc: post[`content_description_${i}`],
                img: post[`content_image_${i}`],
            });
        }
    }

    // Assuming a maximum of 15 steps, adjust as needed
    for (let i = 1; i <= 15; i++) {
        if (post[`alternative_content_description_${i}`]) {
            alternativeSteps.push({
                title: post[`alternative_content_title_${i}`],
                desc: post[`alternative_content_description_${i}`],
                img: post[`alternative_content_image_${i}`],
            });
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-10 text-white">

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4.5">
                    {post.content_title_1}
                </h1>

                {/* Intro */}
                {post.contant_para_1 && (
                    <p className="text-gray-300 mb-6">
                        {post.contant_para_1}
                    </p>
                )}

                {/* Steps */}
                {steps.map((step, index) => (
                    <div key={index} className="mb-10 space-y-4">

                        <h3 className="text-lg font-semibold">
                            {index + 1}. {step.desc}
                        </h3>

                        {step.img && (
                            <img
                                src={
                                    step.img.formats?.large?.url ||
                                    step.img.url
                                }
                                className="w-full rounded-xl border border-gray-800"
                                alt="step"
                            />
                        )}
                    </div>
                ))}

                {/* ALTERNATIVE SECTION */}
                {post.alternative && alternativeSteps.length > 0 && (
                    <div className="mt-12">

                        <h2 className="text-2xl font-bold mb-4">
                            {post.alternative_content_title_1}
                        </h2>

                        {alternativeSteps.map((step, index) => (
                            <div key={index} className="mb-10 space-y-4">

                                <h3 className="text-lg font-semibold">
                                    {index + 1}. {step.desc}
                                </h3>

                                {step.img && (
                                    <img
                                        src={
                                            step.img.formats?.large?.url ||
                                            step.img.url
                                        }
                                        className="w-full rounded-xl border border-gray-800"
                                        alt="alternative step"
                                    />
                                )}
                            </div>
                        ))}

                    </div>
                )}

                {post.after_step_last_message && (
                    <p className="text-gray-300 mb-6">
                        {post.after_step_last_message}
                    </p>
                )}

            </div>
        </div>
    );
}

// export default function BlogPost({ post }) {
//     return (
//         <div className="min-h-screen">
//             <div className="max-w-4xl mx-auto px-4 py-10 text-white">

//                 {/* Main Title */}
//                 <h1 className="text-3xl md:text-4xl font-bold mb-6">
//                     {post.content_title_1}
//                 </h1>

//                 {/* Intro */}
//                 {post.contant_para_1 && (
//                     <p className="text-gray-300 mb-4">
//                         {post.contant_para_1}
//                     </p>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Step 1 */}
//                 {post.content_description_1 && (
//                     <div className="space-y-4 mb-8">

//                         <h3 className="text-lg font-semibold">
//                             {post.content_description_1}
//                         </h3>

//                         {post.content_image_1 && (
//                             <img
//                                 src={
//                                     post.content_image_1.formats?.large?.url ||
//                                     post.content_image_1.url
//                                 }
//                                 className="w-full rounded-xl border border-gray-800"
//                                 alt="step"
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* You can repeat for more steps later */}
//             </div>
//         </div>
//     );
// }