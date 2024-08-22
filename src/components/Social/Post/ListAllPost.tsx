import React, { useEffect, useState } from 'react';
import useApiPost from '../../../hooks/PostData';
import Pagination_comp from '../../Reusable/Pagenation';
import { FaRegCommentDots, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper as ReactSwiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Modal from '../../Reusable/Model';
import CommentsList from './ListComments';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import axios from 'axios';
import FullScreenImageModal from '../../Reusable/FullScreenImageModal'; // Adjust path as necessary
import PostDetailWithTabs from './PostDetails';

interface Post {
    post_id: number;
    createdAt: string;
    location: string;
    post_desc: string;
    Profile?: {
        profile_pic: string;
        user_name: string;
        first_name: string;
        last_name: string;
    };
    Media: {
        media_location: string;
    }[];
    totalLikes: number;
    totalComments: number;
    isLiked: boolean;
}

const ListAllPost: React.FC = () => {
    const { postData, loading, error, data } = useApiPost();
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [LikeCount, setLikeCount] = useState<number | null>(null);
    const [CommentCount, setCommentCount] = useState<number | null>(null);
    const [selectedTab, setSelectedTab] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Full-screen image modal state
    const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState<boolean>(false);
    const [fullScreenImages, setFullScreenImages] = useState<string[]>([]);
    const [initialSlideIndex, setInitialSlideIndex] = useState<number>(0);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postData('list-all-post', {
                    page: currentPage,
                    limit: pageSize
                });

                setPosts(response.data.map((post: Post) => ({
                    ...post,
                    isLiked: false
                })));
                setCurrentPage(response.currentPage);
                setTotalPages(response.totalPages);
            } catch (err) {
                console.error("Failed to fetch posts", err);
            }
        };

        fetchPosts();
    }, [currentPage, pageSize]);

    const openCommentsModal = (postId: number) => {
        const selectedPost = posts.find(post => post.post_id === postId);
        if (selectedPost) {
            setLikeCount(selectedPost.totalLikes);
            setCommentCount(selectedPost.totalComments);
        }
        setSelectedTab("comments")

        setSelectedPostId(postId);
        setIsModalOpen(true);
    };

    /**
 * Opens the modal for viewing likes and comments of a specific post.
 * 
 * This function finds the selected post by its ID from the `posts` array,
 * sets the like and comment counts for that post, and then opens the modal
 * with the "likes" tab selected.
 *
 * @param {number} postId - The ID of the post for which the likes modal should be opened.
 */

    const openLikesModal = (postId: number) => {
        const selectedPost = posts.find(post => post.post_id === postId);
        if (selectedPost) {
            setLikeCount(selectedPost.totalLikes);
            setCommentCount(selectedPost.totalComments);
        }
        setSelectedTab("likes")
        setSelectedPostId(postId);
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPostId(null);
    };

    const handleLike = async (postId: number) => {
        try {
            const response = await axios.post('like', { post_id: postId }, { params: { post_id: postId } });
            console.log(response);

            const updatedPosts = posts.map(post =>
                post.post_id === postId ? { ...post, isLiked: !post.isLiked, totalLikes: post.isLiked ? post.totalLikes - 1 : post.totalLikes + 1 } : post
            );
            setPosts(updatedPosts);
        } catch (err) {
            console.error("Failed to like/unlike post", err);
        }
    };

    const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);

    const toggleShowMore = (postId: number) => {
        if (expandedPostIds.includes(postId)) {
            setExpandedPostIds(expandedPostIds.filter(id => id !== postId));
        } else {
            setExpandedPostIds([...expandedPostIds, postId]);
        }
    };

    // Full-screen modal functions
    const openFullScreenModal = (images: string[], initialSlideIndex: number) => {
        setFullScreenImages(images);
        setInitialSlideIndex(initialSlideIndex);
        setIsFullScreenModalOpen(true);
    };

    const closeFullScreenModal = () => {
        setIsFullScreenModalOpen(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-600">Error: {error.message}</p></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {posts.length > 0 ? (
                    posts.map((post) => {
                        const isExpanded = expandedPostIds.includes(post.post_id);
                        const showMoreButton = post.post_desc.split('\n').length > 3 || post.post_desc.length > 100;
                        const postDate = parseISO(post.createdAt);
                        const now = new Date();
                        const timeDifference = now.getTime() - postDate.getTime();
                        const minutesAgo = Math.floor(timeDifference / (1000 * 60));
                        const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
                        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        const formattedDate = daysAgo > 7
                            ? format(postDate, 'MMMM d, yyyy')
                            : minutesAgo < 60
                                ? `${minutesAgo} mins ago`
                                : hoursAgo < 24
                                    ? `${hoursAgo} hrs ago`
                                    : formatDistanceToNow(postDate, { addSuffix: true });

                        return (
                            <div key={post.post_id} className="mb-6">
                                <div className="bg-white shadow-md rounded-lg border h-96 border-gray-200 dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                                    {Array.isArray(post.Media) && post.Media.length > 0 && (
                                        <div className="rounded-t-lg overflow-hidden">
                                            <ReactSwiper
                                                modules={[Navigation, Pagination]}
                                                slidesPerView={1}
                                                spaceBetween={10}
                                                loop={false}
                                                pagination={{ clickable: true }}
                                                className="swiper-container"
                                            >
                                                {post.Media.map((media, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img
                                                            src={media.media_location}
                                                            alt={`Post Media ${index + 1}`}
                                                            className="w-full h-60 object-cover cursor-pointer"
                                                            onClick={() => openFullScreenModal(post.Media.map(m => m.media_location), index)}
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </ReactSwiper>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-500 text-xs font-bold">
                                                {formattedDate}
                                            </span>
                                            <span className="text-gray-500 text-xs font-bold">
                                                {format(postDate, 'HH:mm')}
                                            </span>
                                        </div>

                                        <h5 className="text-gray-700 dark:text-gray-300 mb-2">
                                            {post.post_desc.length > 80
                                                ? `${post.post_desc.slice(0, 80).split('\n').slice(0, 3).join('\n')}...`
                                                : post.post_desc}
                                        </h5>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                {post.Profile?.profile_pic !== "http://192.168.0.27:3008/uploads/profile-image.jpg" ? (
                                                    <img
                                                        src={post.Profile.profile_pic}
                                                        alt="Profile"
                                                        className="w-9 h-9 rounded-full mr-2 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-gray-200 font-bold mr-2 dark:bg-gray-700">
                                                        {post.Profile?.first_name?.[0]}{post.Profile?.last_name?.[0]}
                                                    </div>
                                                )}
                                                <div className="text-gray-700 dark:text-gray-300">
                                                    {post.Profile?.first_name} {post.Profile?.last_name}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => openLikesModal(post.post_id)}
                                                    className="flex items-center text-primary mr-4"
                                                >
                                                    {post.isLiked ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                                                    <span className="ml-1">{post.totalLikes}</span>
                                                </button>
                                                <button
                                                    onClick={() => openCommentsModal(post.post_id)}
                                                    className="flex items-center text-primary"
                                                >
                                                    <FaRegCommentDots className="w-5 h-5" />
                                                    <span className="ml-1">{post.totalComments}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="w-full text-center text-gray-500">No posts available</div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination_comp
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}

            {selectedPostId && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <PostDetailWithTabs
                        postId={selectedPostId}
                        LikeCount={LikeCount}
                        CommentCount={CommentCount}
                        selectedTab={selectedTab}
                    />

                </Modal>
            )}

            {isFullScreenModalOpen && (
                <FullScreenImageModal
                    images={fullScreenImages}
                    initialSlide={initialSlideIndex}
                    onClose={closeFullScreenModal}
                    isOpen={isFullScreenModalOpen}
                />
            )}

        </div>
    );
};

export default ListAllPost;
