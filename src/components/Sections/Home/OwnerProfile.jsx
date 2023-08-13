import React, { useEffect, useMemo, useState } from "react";
import { dataSortByType } from "../../../utils/utils";
import CollectionitemV2 from "../../Common/CollectionCard";
import BaseLayout from "../../Layout/BaseLayout/BaseLayout";
import CollectionHeader from "../../Common/CollectionHeader";
import { useDispatch, useSelector } from "react-redux";
import { getByUsername } from "../../../api-services/userService";
import Search from "../../Common/Search";
import {
  collectionFetchingFailed,
  collectionFetchingSuccess,
  collectionFething,
} from "../../../store/Slices/collection.slice";
import PageLoader from "../../UI/Loader/PageLoader";
import {
  downvoteAction,
  upvoteAction,
} from "../../../store/actions/collection.action";
import { SortActions } from "../../Common/ActiondropDown";
const OwnerProfile = ({ username, windowWidth }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const collection = useSelector((state) => state.collection);

  const menuItem = [
    {
      name: "Recently Updated",
      onClick: "",
      tag: "RECENETLY_UPDATED",
    },
    {
      name: "Most Upvotes",
      onClick: "",
      tag: "RECENETLY_UPDATED",
    },
    {
      name: "Most Links",
      onClick: "",
      tag: "RECENETLY_UPDATED",
    },
  ];

  useEffect(() => {
    // dispatch(getUserCollection({username}));
    async function getCollectionOfTheUser() {
      dispatch(collectionFething());
      try {
        const res = await getByUsername(username);
        dispatch(collectionFetchingSuccess({ data: res.data.data }));
      } catch {
        dispatch(collectionFetchingFailed());
      }
    }
    getCollectionOfTheUser();
  }, [dispatch, username]);

  const filteredCollection = useMemo(() => {
    return (
      !collection.isFetching &&
      collection.collections.filter((cItem) =>
        cItem.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, collection.collections]);

  return (
    <BaseLayout>
      {/* Top bar */}
      <div className="flex flex-col items-start justify-center w-full gap-4 mx-auto 3xl:px-0 px-8 max-w-[1500px]">
        <CollectionHeader
          windowWidth={windowWidth}
          isOwner={true}
          name="My Collection"
        />
        <div
          className={`w-full flex items-start justify-between gap-6 ${
            windowWidth < 700 ? "hidden" : ""
          }`}
        >
          <div className=" w-[calc(100%-212px)]">
            <Search query={query} setQuery={setQuery} />
          </div>

          {/* sort by */}
          <SortActions name="Sort By" menuItems={menuItem} />
        </div>
      </div>
      {/* Collections */}
      <div className=" w-full h-[70%]">
        {collection.isFetching ? (
          <div className="flex items-center justify-center w-full h-full">
            <PageLoader />
          </div>
        ) : filteredCollection.length > 0 ? (
          <div className="flex items-start justify-start w-full h-full pl-8 mx-auto overflow-y-scroll 3xl:pl-0 3xl:justify-center">
            <div className="w-full justify-start flex flex-wrap gap-2 2xl:gap-6 max-w-[1500px]">
              {filteredCollection.map((collections) => (
                <CollectionitemV2
                  key={collection._id}
                  id={collections._id}
                  image={collections.image}
                  title={collections.title}
                  links={collections.timelines.length}
                  isPublic={collections.isPublic}
                  isPinned={collections.isPinned}
                  tags={collections.tags}
                  username={username}
                  windowWidth={windowWidth}
                  isOwner={true}
                  upvotes={collections.upvotes}
                  views={collections.views}
                  onUpvote={upvoteAction}
                  onDownVote={downvoteAction}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="mb-5 text-5xl text-textPrimary">
              No Collection Found
            </p>
            <p className="text-textPrimary">You can add it from extension</p>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default OwnerProfile;
