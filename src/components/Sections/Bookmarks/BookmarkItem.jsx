// Package Imports
import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
// Assets Imports
import copyIcon from '../../../assets/copyIcon.svg';
import menuIcon from '../../../assets/3dot.svg';
import redirectIcon from '../../../assets/redirectIcon.svg';
import approveIcon from '../../../assets/approve.svg';
import bookmarkDefalutIcon from '../../../assets/bookmarkDefault.svg';
import pinIcon from '../../../assets/bookmarkPin.svg';
import whitePinIcon from '../../../assets/darkMode/pinIcon.svg';
import MenuWhiteIcon from '../../../assets/darkMode/MenuWhiteIcon.svg';
import RedirectWhiteIcon from '../../../assets/darkMode/RedirectWhiteIcon.svg';
import CopyWhiteIcon from '../../../assets/darkMode/whiteCopyIcon.svg';
import NoteIcon from '../../../assets/note.svg';
import WhiteNoteIcon from '../../../assets/darkMode/NoteIcon.svg';

// Utils Imports
import { nameShortner, getOrigin, fromNow } from '../../../utils/utils';

// Components
import EcBookamrkModal from './ECBookmarkModal';
import { MenuItem } from '../../Common/ActiondropDown';
import Delete from './DeleteModal';
import IconButton from '../../UI/IconButton/IconButton';
import { switchMode } from '../../../hooks/switchMode';
import BookmarkNoteModal from './BookmarkNoteModal';

const BookmarkItem = ({
  id,
  name,
  url,
  note,
  favicon,
  windowWidth,
  updatedAt,
  isOwner,
  clickedId,
  setClickedId,
  isSelected,
  isPinned,
  isStillOneBookmarkSelected,
  onSelectedBookmark,
  onUnSelectBookamrk,
  collectionId,
  movebokmark,
  deleteBookmark,
  toggleBookmarkPin,
  collectionName,
}) => {
  // to see if checked or not
  const [checked, setChecked] = useState(false);
  const [openEditBookmarkModal, setOpenEditBookmarkModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [bookmarkDeleteModal, setBookmarkDeleteModal] = useState(false);
  const [bookmarkNoteModal, setBookmarkNoteModal] = useState(false);
  const auth = useSelector(state => state.auth);
  const bookmarkDeleteModalHandler = () => {
    setBookmarkDeleteModal(prev => !prev);
  };
  useEffect(() => {
    if (isSelected) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [isSelected]);

  const copyRef = useRef();

  const bookmarkEditModalHandler = () => {
    setOpenEditBookmarkModal(prev => !prev);
  };

  const onCopy = () => {
    if (copyRef) copyRef.current.src = approveIcon;
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      try {
        copyRef.current.src = copyIcon;
      } catch (error) {
        // console.error(error)
      }
    }, 500);
  };

  const onActionClickeHandler = type => {
    switch (type) {
      case 'EDIT':
        bookmarkEditModalHandler();
        setClickedId(null);
        return;
      case 'DELETE':
        bookmarkDeleteModalHandler();
        setClickedId(null);
        return;
      case 'PIN':
        setClickedId(null);
        toggleBookmarkPin(id);
        return;
    }
  };

  const handleBookmarkNoteModal = () => {
    setBookmarkNoteModal(prev => !prev);
  };

  useEffect(() => {
    if (hovered) {
      setBookmarkNoteModal(true);
    } else {
      setBookmarkNoteModal(false);
    }
  }, [hovered]);

  const getFaviconFromURL = link => {
    const favIconBaseURL =
      'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
    const origin = new URL(link).origin;
    return `${favIconBaseURL}${origin}`;
  };

  // Popup Action menu
  const popupActionMenu = useMemo(() => {
    return [
      {
        name: 'Edit',
        onClick: onActionClickeHandler,
        type: 'EDIT',
      },
      {
        name: !isPinned ? 'Pin' : 'Unpin',
        onClick: onActionClickeHandler,
        type: 'PIN',
      },
      // Move Menu will be here

      {
        name: 'Delete',
        onClick: onActionClickeHandler,
        type: 'DELETE',
      },
    ];
  }, [isPinned]);

  // dark and light mode switch
  const { selectedMode } = useContext(switchMode);

  return (
    <>
      <EcBookamrkModal
        isOpen={openEditBookmarkModal}
        onClose={bookmarkEditModalHandler}
        isEditing={true}
        collectionID={collectionId}
        originalData={{
          title: name,
          link: url,
          note: note,
        }}
        bookmarkID={id}
      />
      <Delete
        onClose={bookmarkDeleteModalHandler}
        isOpen={bookmarkDeleteModal}
        collectionID={collectionId}
        bookmarkID={id}
        heading="Delete Bookmark"
        subheading={`Delete ${name} from ${collectionName}`}
      />

      <div
        // className={`cursor-pointer relative flex items-center justify-between w-full h-[60px] rounded-xl
        className={`cursor-pointer  relative grid grid-cols-[1fr_70px] sm:grid-cols-[5fr_140px_70px] gap-[0.75rem] sm:gap-[2rem] items-center justify-between w-full h-[60px] rounded-xl 
          ${
            selectedMode === 'light'
              ? hovered
                ? 'bg-neutral-200 border-neutral-200'
                : 'bg-neutral-100 border-neutral-200'
              : hovered
              ? 'bg-dark-secondary border-dark-secondary'
              : 'bg-dark-primary border-dark-border'
          } border   duration-200 transition-all group`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {note && bookmarkNoteModal && (
          <BookmarkNoteModal
            note={note}
            className={'absolute'}
          ></BookmarkNoteModal>
        )}
        {/* Note this below input is to be shown to owner only after  implementing state mangement resolve it */}
        {/* {isOwner && <input
            type="checkbox"
            className={` cursor-pointer custom-checkbox rounded-md ${isStillOneBookmarkSelected
                ? "ml-2"
                : "opacity-0 group-hover:opacity-100 absolute top-0 -left-1"
              } `}
            checked={checked}
            onChange={handleCheck}
          />} */}
        {isPinned && (
          <div
            className={`w-[20px] h-[20px] absolute z-[100] top-[20px] left-[-13px] cursor-pointer border  ${
              selectedMode === 'light'
                ? 'border-neutral-300 bg-neutral-100'
                : 'bg-dark-primary border-dark-secondary'
            }  rounded-md`}
          >
            {selectedMode === 'light' ? (
              <img key="pin-icon" className="" src={pinIcon} alt="" />
            ) : (
              <img key="pin-icon" className="" src={whitePinIcon} alt="" />
            )}
          </div>
        )}

        <a
          className="flex items-center justify-start truncate lg:max-w-[80%] "
          href={url}
          rel="noreferrer"
          target="_blank"
        >
          {/* Bookamrk Info: Name , Link, Image */}
          {/* <div className="flex items-center"> */}
          {/* Bookmark Image */}
          <div className="min-w-[48px] min-h-[48px] block flex items-center justify-center">
            <img
              src={
                favicon !== 'undefined' && favicon !== undefined
                  ? favicon
                  : getFaviconFromURL(url)
              }
              alt="Icon"
              className="w-[30.68px] h-[30px] rounded-md object-contain"
            />
          </div>

          {/* Bookmark Name, Link name */}
          <div className="flex flex-col block truncate items-start justify-center gap-[2.63px] h-10 sm:h-10">
            {/* Bookmark Name */}
            <p
              className={`font-normal block text-start para text-[0.9rem] ${
                selectedMode === 'light'
                  ? 'text-neutral-900'
                  : 'text-borderPrimary'
              }   sm:h-[21px]`}
            >
              {/* {windowWidth > 640
                  ? windowWidth > 768
                    ? windowWidth > 1024
                      ? windowWidth > 1280
                        ? windowWidth > 1400
                          ? nameShortner(name, 110)
                          : nameShortner(name, 70)
                        : nameShortner(name, 40)
                      : nameShortner(name, 25)
                    : nameShortner(name, 20)
                  : nameShortner(name, 23)} */}
              {name}
            </p>

            {/* Link Name */}
            <p
              className={`text-start text-[0.8rem] sm:text-[12px] sm:w-[271px] ${
                selectedMode === 'light'
                  ? 'text-neutral-500'
                  : 'text-dark-placeholder'
              } mt-[0.1rem] `}
            >
              {windowWidth < 640
                ? nameShortner(getOrigin(url), 25)
                : nameShortner(getOrigin(url), 40)}
            </p>
          </div>
          {/* </div> */}
        </a>

        {/* Note Attached,  Timestamp, Actions: Note, Open Link, Popup menu */}

        <div className="items-center justify-start hidden gap-10 sm:flex">
          {/* Note attached  if note is attached */}
          {note && !hovered && windowWidth > 1024 && (
            <div
              className={`flex  items-center justify-center absolute top-1/2 -translate-y-1/2 right-[40%] xl:right-[27%] ${
                windowWidth < 1150 && ''
              } transition-all duration-300 z-50 xl:p-0.9 rounded-md border border-primary-500 p-1 text-xs xl:text-sm font-normal  ${
                selectedMode === 'light'
                  ? 'text-charcoalGray bg-neutral-100'
                  : 'bg-dark-primary text-neutral-50'
              } `}
            >
              {windowWidth > 1280 ? (
                ' Note Attached'
              ) : (
                <>
                  {selectedMode === 'light' ? (
                    <img src={NoteIcon} alt="" className="" />
                  ) : (
                    <img src={WhiteNoteIcon} alt="" className="" />
                  )}
                </>
              )}
            </div>
          )}

          <div className="hidden sm:flex items-center gap-[4rem] mr-2">
            {/* Timestamp */}
            <p
              className={`hidden sm:block text-xs font-medium whitespace-nowrap  ${
                selectedMode === 'light'
                  ? 'text-neutral-500'
                  : 'text-dark-placeholder'
              } mr-5`}
            >
              Added {fromNow(updatedAt)}
            </p>
          </div>
        </div>

        {/* Actions: Note, Open Link, Popup menu */}
        {/* All actions should work only when all links is not selected */}
        {!isStillOneBookmarkSelected && (
          <div className="flex justify-end gap-4 pr-4">
            <IconButton
              onClick={onCopy}
              className="flex items-center justify-center "
            >
              {selectedMode === 'light' ? (
                <img
                  ref={copyRef}
                  src={copyIcon}
                  alt=""
                  className="block mx-auto cursor-pointer"
                />
              ) : (
                <img
                  ref={copyRef}
                  src={CopyWhiteIcon}
                  alt=""
                  className="block mx-auto cursor-pointer"
                />
              )}
            </IconButton>
            {/* <a
                className="items-center hidden sm:flex"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {selectedMode === "light" ?
                  <img
                    src={redirectIcon}
                    alt=""
                    className="block mx-auto cursor-pointer "
                  />
                  :
                  <img
                    src={RedirectWhiteIcon}
                    alt=""
                    className="block mx-auto cursor-pointer "
                  />
                }
              </a> */}
            {auth.isLoggedIn && isOwner && (
              <div className="relative">
                <button
                  className="flex items-center"
                  onClick={() =>
                    setClickedId(prev => (prev === id ? null : id))
                  }
                >
                  {selectedMode === 'light' ? (
                    <img
                      src={menuIcon}
                      alt=""
                      className="block mx-auto cursor-pointer threedotbutton"
                    />
                  ) : (
                    <img
                      src={MenuWhiteIcon}
                      alt=""
                      className="block mx-auto cursor-pointer threedotbutton"
                    />
                  )}
                </button>
                {clickedId === id && (
                  <motion.div
                    id="options"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`w-[135px] rounded border absolute z-[9990] top-[28px] p-2 right-0 ${
                      selectedMode === 'light'
                        ? 'border-neutral-300 bg-neutral-100'
                        : 'border-dark-border bg-dark-primary'
                    } `}
                  >
                    {popupActionMenu.map((menuItem, index) => (
                      <>
                        <MenuItem
                          name={menuItem.name}
                          onClick={menuItem.onClick}
                          type={menuItem.type}
                          key={menuItem.type}
                        />
                        {index !== popupActionMenu.length - 1 && (
                          <div
                            className={`w-full h-[1px] ${
                              selectedMode === 'light'
                                ? 'bg-neutral-300'
                                : 'bg-dark-border'
                            } mt-1 mb-1`}
                          />
                        )}
                      </>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkItem;
