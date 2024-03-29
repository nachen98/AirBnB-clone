import './SingleSpot.css';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot, deleteSpot } from '../../store/spots';
import { getAllReviewsBySpot } from '../../store/review';
import CreateReviewModal from '../CreateReviewModal';
import SpotReview from '../SpotReview';
import { BookingCard } from '../BookingCard';

export function SingleSpot() {

    const { spotId } = useParams()
    const dispatch = useDispatch();
    const history = useHistory()
    const oneSpotById = useSelector(state => state.spots.singleSpot)
    const currUser = useSelector(state => state.session.user)
    const reviews = useSelector(state => state.reviews.spot)

    const reviewContents = Object.values(reviews)
    useEffect(() => {
        dispatch(getOneSpot(spotId))
        dispatch(getAllReviewsBySpot(spotId))
    }, [dispatch, spotId])



    let currUserIsOwner = false;
    if (currUser && "id" in currUser && currUser.id === oneSpotById.ownerId) currUserIsOwner = true;

    const deleteSpotButton = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpot(spotId))
        history.push('/')
    }


    if (Object.keys(oneSpotById).length === 0) return null
    console.log('oneSpotById!!!!!!!', oneSpotById)

    let userCreatedReview = false
    if (currUser && "id" in currUser) {
        let filteredContents = reviewContents.filter(reviewContent => reviewContent.userId === currUser.id)
        if (filteredContents.length > 0) userCreatedReview = true
    } else
        userCreatedReview = true;


    return (
        <div className='single-spot-info'>
            <div className='spot-name'>
                {oneSpotById?.name}
            </div>

            <div className='star-rating-review-location'>
                <div className="info-without-button">
                    <div className='rating-star'>
                        <i className="fa-solid fa-star"></i>
                        {Number(oneSpotById.avgStarRating) !== 0 ? Number(oneSpotById.avgStarRating).toFixed(1) : ` New`}
                    </div>
                    <div className="space">  ·  </div>
                    <div className='single-spot-review'>

                        {oneSpotById?.numReviews} reviews

                    </div>

                    <div className="space">  ·  </div>
                    <div className='single-spot-location'>{`${oneSpotById.city}, ${oneSpotById.state}, ${oneSpotById.country}`}</div>
                </div>

                <div className='buttons'>

                    {currUserIsOwner && (
                        <div >
                            <button onClick={deleteSpotButton} className='delete-spot-button'>Delete spot</button>
                            <button onClick={() => history.push(`/spots/${spotId}/edit`)} className="edit-spot-button">Edit spot</button>
                        </div>

                    )}
                </div>
            </div>

            <div >

                {oneSpotById.SpotImages.map(img =>
                    (<img key={img.id} src={img.url} alt={img.url} className='single-spot-img'/>)
                )}
            </div>
            <div className='single-spot-info-container'>
                <div className='spot-info-left'>
                    <div className='single-spot-owner'>
                        <spa>Home hosted by: {oneSpotById.Owner.firstName} {oneSpotById.Owner.lastName}  </spa>

                    </div>
                    <div className='single-spot-description'>
                        <span>{oneSpotById.description}</span>
                    </div>

                </div>
                
                <BookingCard oneSpotById={oneSpotById} currUser={currUser}/>
                


            </div>
            <div className='review-container'>

                <div className='big-star-reviews'>

                    <div className='big-rating-star'>
                   
                        <i className="fa-solid fa-star fa-1.75x"></i>
                        {Number(oneSpotById.avgStarRating) !== 0 ? Number(oneSpotById.avgStarRating).toFixed(1) : ` New`}
                    </div>
                    <div className="space">  ·  </div>
                    <div className='single-spot-review'>
                        {oneSpotById?.numReviews} reviews
                    </div>

                    {!userCreatedReview && !currUserIsOwner && (
                        <CreateReviewModal spotId={spotId} />
                    )}

                </div>
                        
                <div className='review-outer-container'>
                {reviewContents.map(reviewContent => {
                    
                    return (<SpotReview key={reviewContent.id} reviewContent={reviewContent} />)
                }
                )}
                </div>
                

            </div>
        </div>
    )
}